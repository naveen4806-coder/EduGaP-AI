"""
EdUGaP AI - Student Academic Risk Production MLP Model Training
Trains a high-performance 4-layer regularized Multilayer Perceptron on the
production student cohort dataset (15,000 records) with AdamW, Cosine Annealing,
and multi-format production exports (PyTorch, TorchScript, ONNX).
"""

import os
import json
import hashlib
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA_DIR = os.path.join(BASE_DIR, "data")
DEFAULT_MODELS_DIR = os.path.join(BASE_DIR, "models")

FEATURE_NAMES = [
    "previous_assessment_avg",
    "recent_assessment_score",
    "topic_wise_accuracy",
    "quiz_completion_rate",
    "attendance_percentage",
    "assignment_completion_rate",
    "study_session_completion_rate",
    "avg_daily_study_time_minutes",
    "late_submissions_count",
    "integrity_events_count",
    "weak_topics_count",
    "assessment_attempt_count",
]

RISK_MAPPING = {0: "Low Risk", 1: "Medium Risk", 2: "High Risk"}


class StudentDataset(Dataset):
    def __init__(self, features: np.ndarray, labels: np.ndarray):
        self.features = torch.tensor(features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]


class StudentRiskMLP(nn.Module):
    """
    EdUGaP AI Launch-Ready Production Architecture:
    Input (12 features) -> Linear(12, 64) -> BatchNorm1d(64) -> ReLU -> Dropout(0.20)
                        -> Linear(64, 32) -> BatchNorm1d(32) -> ReLU -> Dropout(0.20)
                        -> Linear(32, 16) -> ReLU
                        -> Linear(16, 3) (Logits for Low, Medium, High Risk)
    """
    def __init__(self, input_dim: int = 12, num_classes: int = 3, dropout_rate: float = 0.20):
        super(StudentRiskMLP, self).__init__()
        self.layer1 = nn.Linear(input_dim, 64)
        self.bn1 = nn.BatchNorm1d(64)
        self.relu1 = nn.ReLU()
        self.drop1 = nn.Dropout(p=dropout_rate)

        self.layer2 = nn.Linear(64, 32)
        self.bn2 = nn.BatchNorm1d(32)
        self.relu2 = nn.ReLU()
        self.drop2 = nn.Dropout(p=dropout_rate)

        self.layer3 = nn.Linear(32, 16)
        self.relu3 = nn.ReLU()

        self.out = nn.Linear(16, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.drop1(self.relu1(self.bn1(self.layer1(x))))
        x = self.drop2(self.relu2(self.bn2(self.layer2(x))))
        x = self.relu3(self.layer3(x))
        return self.out(x)


def compute_file_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()


def train_model(
    data_dir: str = DEFAULT_DATA_DIR,
    models_dir: str = DEFAULT_MODELS_DIR,
    epochs: int = 80,
    batch_size: int = 64,
    lr: float = 0.002,
    patience: int = 14
):
    os.makedirs(models_dir, exist_ok=True)
    
    # Load metadata and scaler
    meta_path = os.path.join(models_dir, "metadata.json")
    with open(meta_path, "r") as f:
        metadata = json.load(f)

    scaler_path = os.path.join(models_dir, "scaler.pkl")
    scaler = joblib.load(scaler_path)

    # Load partitions
    train_df = pd.read_csv(os.path.join(data_dir, "train.csv"))
    val_df = pd.read_csv(os.path.join(data_dir, "val.csv"))

    X_train = scaler.transform(train_df[FEATURE_NAMES])
    y_train = train_df["risk_level"].values

    X_val = scaler.transform(val_df[FEATURE_NAMES])
    y_val = val_df["risk_level"].values

    train_dataset = StudentDataset(X_train, y_train)
    val_dataset = StudentDataset(X_val, y_val)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Training Launch-Ready PyTorch MLP on device: {device}")

    model = StudentRiskMLP(input_dim=len(FEATURE_NAMES), num_classes=3, dropout_rate=0.20).to(device)

    # Inverse frequency class weighting
    class_weights = torch.tensor(metadata["class_weights"], dtype=torch.float32).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    best_val_loss = float("inf")
    patience_counter = 0
    best_model_state = None
    best_epoch = 0

    history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0

        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * batch_x.size(0)
            _, predicted = torch.max(outputs, 1)
            train_total += batch_y.size(0)
            train_correct += (predicted == batch_y).sum().item()

        scheduler.step()

        epoch_train_loss = train_loss / train_total
        epoch_train_acc = train_correct / train_total

        # Validation loop
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for batch_x, batch_y in val_loader:
                batch_x, batch_y = batch_x.to(device), batch_y.to(device)
                outputs = model(batch_x)
                loss = criterion(outputs, batch_y)

                val_loss += loss.item() * batch_x.size(0)
                _, predicted = torch.max(outputs, 1)
                val_total += batch_y.size(0)
                val_correct += (predicted == batch_y).sum().item()

        epoch_val_loss = val_loss / val_total
        epoch_val_acc = val_correct / val_total

        history["train_loss"].append(epoch_train_loss)
        history["val_loss"].append(epoch_val_loss)
        history["train_acc"].append(epoch_train_acc)
        history["val_acc"].append(epoch_val_acc)

        if epoch % 5 == 0 or epoch == 1:
            print(f"Epoch {epoch:02d}/{epochs:02d} | Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f} | Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")

        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            best_model_state = model.state_dict()
            best_epoch = epoch
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at epoch {epoch}. Best epoch: {best_epoch} (Val Loss: {best_val_loss:.4f})")
                break

    # 1. Save standard PyTorch checkpoint
    model_save_path = os.path.join(models_dir, "student_risk_mlp.pt")
    torch.save({
        "model_state_dict": best_model_state,
        "input_dim": len(FEATURE_NAMES),
        "num_classes": 3,
        "best_epoch": best_epoch,
        "best_val_loss": best_val_loss,
        "model_version": "v1.0.0-production-launch",
        "feature_names": FEATURE_NAMES,
    }, model_save_path)
    print(f"[OK] PyTorch checkpoint saved to: {model_save_path}")

    # Load best model for exports
    eval_model = StudentRiskMLP(input_dim=len(FEATURE_NAMES), num_classes=3, dropout_rate=0.20)
    eval_model.load_state_dict(best_model_state)
    eval_model.eval()

    # 2. Export TorchScript JIT Model (for ultra-low latency C++ / Python serving)
    torchscript_path = os.path.join(models_dir, "student_risk_mlp.torchscript.pt")
    dummy_input = torch.randn(1, len(FEATURE_NAMES), dtype=torch.float32)
    traced_script_module = torch.jit.trace(eval_model, dummy_input)
    traced_script_module.save(torchscript_path)
    print(f"[OK] TorchScript JIT model exported to: {torchscript_path}")

    # 3. Export ONNX Model (universal cross-platform deployment)
    onnx_path = os.path.join(models_dir, "student_risk_mlp.onnx")
    onnx_exported = False
    try:
        torch.onnx.export(
            eval_model,
            dummy_input,
            onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["student_features"],
            output_names=["risk_logits"],
            dynamic_axes={"student_features": {0: "batch_size"}, "risk_logits": {0: "batch_size"}}
        )
        print(f"[OK] ONNX model exported to: {onnx_path}")
        onnx_exported = True
    except Exception as onnx_err:
        print(f"[NOTICE] ONNX export optional dependency notice: {onnx_err}. TorchScript and PyTorch formats active.")

    # Compute checksums and update metadata
    metadata["production_ready"] = True
    metadata["model_version"] = "v1.0.0-production-launch"
    metadata["best_epoch"] = best_epoch
    metadata["best_val_loss"] = round(float(best_val_loss), 5)
    metadata["artifacts"] = {
        "pytorch_checkpoint": {
            "file": "student_risk_mlp.pt",
            "sha256": compute_file_sha256(model_save_path)
        },
        "torchscript": {
            "file": "student_risk_mlp.torchscript.pt",
            "sha256": compute_file_sha256(torchscript_path)
        }
    }
    if onnx_exported and os.path.exists(onnx_path):
        metadata["artifacts"]["onnx"] = {
            "file": "student_risk_mlp.onnx",
            "sha256": compute_file_sha256(onnx_path)
        }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Metadata manifest updated with SHA256 checksums at {meta_path}")

    # Save training history
    history_path = os.path.join(models_dir, "training_history.json")
    with open(history_path, "w") as f:
        json.dump({
            "best_epoch": best_epoch,
            "best_val_loss": best_val_loss,
            "history": history
        }, f, indent=2)
    print(f"[OK] Training history written to {history_path}")


if __name__ == "__main__":
    train_model()
