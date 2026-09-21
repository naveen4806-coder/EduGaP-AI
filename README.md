# EdUGaP AI &mdash; &ldquo;Education Gap Filler AI&rdquo;

![EdUGaP AI Architecture](https://img.shields.io/badge/Platform-Full--Stack%20Web%20App-indigo.svg)
![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![PyTorch MLP](https://img.shields.io/badge/ML%20Engine-PyTorch%20%7C%20FastAPI-red.svg)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20%2B%20RLS-emerald.svg)

**EdUGaP AI** (&ldquo;Education Gap Filler AI&rdquo;) is an institutional, full-stack educational diagnostic and remediation platform designed for K-12 and higher education institutions. It empowers schools to:
1. Identify curriculum learning deficits through proctored diagnostic tests.
2. Evaluate student responses using multi-criteria AI writing rubrics (Clarity, Relevance, Grammar, Topic Understanding).
3. Automatically formulate adaptive, routine-aware weekly study schedules.
4. Forecast academic attrition using an authentic **4-layer PyTorch MLP risk classification model** trained on standardized student engagement and behavioral indicators.
5. Provide departmental academic oversight for Heads of Department (HODs) with immutable audit logging.

---

## Key Portals & Capabilities

### 1. Student Portal (`/student`)
- **Dashboard**: Live learning streak tracker (e.g. 7-day flame counter), curriculum topic mastery percentage, upcoming assessments calendar, daily study duration metrics, weak topic badges, and academic risk category.
- **Assessment Center**: Published test roster with deadlines, question counts, and duration benchmarks.
- **Monitored Test Taking Interface**:
  - Countdown clock with auto-submission.
  - Periodic autosave tracking.
  - Question navigation palette and progress indicators.
  - Supports Multiple-Choice, Short-Answer, and Descriptive questions.
  - **Anti-Cheat Monitoring Engine**: Blocks copy, paste, right-click context menu, and text selection; monitors `visibilitychange` (tab switching), `blur` (loss of window focus), and fullscreen exits; logs every event with severity to the database and alerts the student.
  - Prominent Cheating Disclaimer: *"Browser monitoring deters misconduct but cannot fully prevent cheating."*
- **Post-Submission Diagnostic Review**:
  - Immediate percentage score and correct vs. incorrect solution explanations.
  - Automatic detection and ranking of diagnosed weak topics.
  - AI writing evaluation rubric breakdown across 4 dimensions: **Clarity**, **Relevance**, **Grammar**, and **Topic Understanding**.
  - Actionable recommendations (e.g. *&ldquo;You need to strengthen Linear Equations. Practice for 20 minutes tomorrow.&rdquo;*).
- **Routine-Aware Study Planner**:
  - Collects daily routine inputs: school end time, commute duration, extracurricular activities, preferred study slots, available study days, and upcoming exam goals.
  - Synthesizes personalized weekly study plans prioritizing diagnosed learning gaps.
  - Interactive checklists allowing students to mark study sessions complete.

### 2. Staff Portal (`/staff`)
- **Faculty Dashboard**: Active tests, total student submissions, class diagnostic averages, identified classwide learning deficits, and at-risk student alerts.
- **Teaching Resource Library**: Upload syllabi, PDFs, DOCX files, previous year question papers, and diagrams. Provides in-browser preview, secure download links, and OCR/text extraction.
- **Assessment Builder**:
  - Author title, subject, class, topic, duration, marks, due date, and learning objectives.
  - Multiple question formats (MCQ, Short Answer, Descriptive) with marks, difficulty levels, topic tags, and official answer keys.
  - **AI Question Generator**: Analyzes uploaded teaching material and generates curriculum-aligned questions.
  - Complete lifecycle management: Save Draft, Publish, Close, Reopen, Duplicate, and Archive.
- **Class Analytics**: Score distribution histograms, topic mastery rankings, test completion rates, and proctored integrity incident logs.
- **Student Progress & Detail Pages**: Comprehensive roster displaying average scores, latest test outcomes, weak topics, risk levels, study plan adherence %, and student history.

### 3. HOD Department Oversight Portal (`/hod`)
- **Executive Dashboard**: Faculty counts, student enrollment totals, active tests, department average score, at-risk student tally, most difficult curriculum topics, integrity summary, and subject-level performance trends.
- **Department Analytics & PyTorch Risk Matrix**:
  - Multi-dimensional comparative performance across Classes, Subjects, and Teachers.
  - Department-wide weak topic ranking and score trends.
  - PyTorch MLP student risk distribution breakdown (Low Risk, Medium Risk, High Risk).
  - Export institutional reports as CSV.
  - **Model Limitation Notice**: Prominently warns that predictions are advisory screening tools to support educators and must never be used as the sole basis for grades, disciplinary action, or admissions decisions.
- **Faculty Management & Student Enrollment**: Approve and deactivate faculty accounts; manage class/subject assignments; view enrollment registries.
- **Assessment Oversight**: Review all faculty assessments, completion rates, averages, and integrity violation frequencies.
- **Institutional Audit Trail**: Immutable log of administrative actions. Enforces strict governance: *HODs cannot alter student scores or answers without providing a mandatory academic justification reason.*

---

## Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS) policies, Supabase Storage (`resources` and `student-submissions` buckets).
- **Push Notifications**: Firebase Cloud Messaging (FCM) device token registration and dispatch.
- **AI Service Layer**: OpenAI-compatible service (`gpt-4o-mini`) with deterministic, zero-dependency offline heuristic fallback.
- **Machine Learning**: Python 3.11, PyTorch, scikit-learn, FastAPI, uvicorn, pandas, numpy.
- **Containerization**: Docker, Docker Compose.

---

## Demo Accounts

The application includes instant 1-click login buttons on `/login` and supports the following credentials:

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Head of Department (HOD)** | `hod@edugap.ai` | `Hod@12345` | `/hod/dashboard` |
| **Teaching Staff** | `staff@edugap.ai` | `Staff@12345` | `/staff/dashboard` |
| **Student** | `student@edugap.ai` | `Student@12345` | `/student/dashboard` |

*Additional pre-seeded student accounts:*
- `marcus.vance@student.edugap.ai` (High Risk student profile with 4 logged integrity flags)
- `elena.rostova@student.edugap.ai` (Low Risk student profile with 94% average score)

---

## Machine Learning Pipeline (PyTorch MLP)

The student risk prediction engine is implemented in the `training/` directory.

### Model Architecture
- **Input Dimension**: 12 standardized student features (Zero Personally Identifiable Information).
- **Hidden Layers**: Linear(12 &rarr; 64) &rarr; ReLU &rarr; Dropout(0.25) &rarr; Linear(64 &rarr; 32) &rarr; ReLU &rarr; Dropout(0.25) &rarr; Linear(32 &rarr; 16) &rarr; ReLU &rarr; Linear(16 &rarr; 3).
- **Loss Function**: Weighted CrossEntropyLoss (counteracts class imbalance).
- **Optimizer**: Adam (`lr=0.001`, `weight_decay=1e-4`) with validation early stopping.
- **Achieved Accuracy**: **95.19%** (Macro F1: 0.923, High-Risk Precision: 0.99, Recall: 0.98).

### Features Schema (Zero PII Guarantee)
1. `previous_assessment_avg` (0-100)
2. `recent_assessment_score` (0-100)
3. `topic_wise_accuracy` (0-100)
4. `quiz_completion_rate` (0-100)
5. `attendance_percentage` (0-100)
6. `assignment_completion_rate` (0-100)
7. `study_session_completion_rate` (0-100)
8. `avg_daily_study_time_minutes` (numerical)
9. `late_submissions_count` (integer)
10. `integrity_events_count` (integer)
11. `weak_topics_count` (integer)
12. `assessment_attempt_count` (integer)

### Running the ML Pipeline Locally
```bash
# 1. Navigate to the training directory
cd training

# 2. (Optional) Create virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Generate UCI & OULAD-aligned benchmark dataset and scaler
python preprocess.py

# 5. Train the 4-layer PyTorch MLP model
python train_mlp.py

# 6. Evaluate accuracy, F1, confusion matrix, and calibration
python evaluate.py

# 7. Start FastAPI prediction microservice on port 8001
uvicorn inference:app --reload --port 8001
```

### ML REST Endpoint
`POST http://localhost:8001/ml/predict-risk`
```json
{
  "previous_assessment_avg": 78.5,
  "recent_assessment_score": 82.0,
  "topic_wise_accuracy": 80.0,
  "quiz_completion_rate": 95.0,
  "attendance_percentage": 94.0,
  "assignment_completion_rate": 90.0,
  "study_session_completion_rate": 85.0,
  "avg_daily_study_time_minutes": 75.0,
  "late_submissions_count": 0,
  "integrity_events_count": 0,
  "weak_topics_count": 1,
  "assessment_attempt_count": 6
}
```

---

## Web Application Setup & Execution

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ (for ML service)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*Note: EdUGaP AI features a dual-mode local fallback engine. You can run and test the application immediately without filling in external API keys.*

### 3. Start Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Database & Migrations

All SQL schema definitions and migrations are located in `supabase/migrations/`:
- `supabase/migrations/20260921000001_initial_schema.sql`: Contains definitions for all 21 tables:
  `departments`, `roles`, `profiles`, `classes`, `subjects`, `enrollments`, `staff_assignments`, `resource_files`, `assessments`, `questions`, `assessment_assignments`, `attempts`, `answers`, `integrity_events`, `study_plans`, `study_sessions`, `ai_recommendations`, `student_feature_snapshots`, `risk_predictions`, `audit_logs`, and `notification_tokens`.
- Row Level Security (RLS) policies enforcing student privacy, staff access, and HOD oversight.
- Supabase storage buckets `resources` and `student-submissions`.
- `supabase/seed.sql`: Seeds initial Grade 10 Mathematics syllabus, demo accounts, assessments, attempts, and audit logs.

To apply to your cloud Supabase project:
```bash
# Push migrations and seed data
supabase db push
# Or run the SQL scripts directly in the Supabase Dashboard SQL Editor
```

---

## Docker & Docker Compose

Deploy the complete multi-service environment (Next.js web app + FastAPI PyTorch microservice) with a single command:

```bash
docker-compose up --build
```
- Web Application: [http://localhost:3000](http://localhost:3000)
- PyTorch ML Service: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## End-to-End User Flow

1. **Staff Sign-in & Resource Upload**:
   - Staff logs in via `staff@edugap.ai`.
   - Navigates to **Resources** and uploads Grade 10 syllabus material.
2. **AI Question Generation & Publishing**:
   - Staff opens **Assessment Builder**, clicks *&ldquo;Generate Questions from Syllabus&rdquo;*, reviews generated MCQs and descriptive problems, and clicks **Publish**.
3. **Student Test Taking & Anti-Cheat Proctored Session**:
   - Student logs in via `student@edugap.ai`.
   - Opens the published assessment and starts the test.
   - The test interface blocks copy/paste and right-click; switching tabs logs an integrity event.
   - Student completes answers and clicks **Submit**.
4. **AI Descriptive Evaluation & Recommendations**:
   - The system computes objective marks and runs the AI writing evaluation rubric.
   - Highlights weak topics and generates a specific study recommendation.
5. **Routine Study Planning**:
   - Student opens **Study Planner**, enters daily hours and commute, and generates a weekly schedule with toggleable completion checkboxes.
6. **Faculty & HOD Oversight**:
   - Staff reviews class analytics, mastery distribution, and integrity logs.
   - HOD inspects department-level trends, reviews the PyTorch MLP risk distribution with the ethical AI notice, and exports reports to CSV.
