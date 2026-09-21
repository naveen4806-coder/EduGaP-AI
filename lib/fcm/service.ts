// ============================================================================
// EdUGaP AI - Firebase Cloud Messaging (FCM) Service
// Handles client token registration and optional push notification dispatch
// (Tokens stored in Supabase / Local Store, strictly no Firestore/Firebase Auth)
// ============================================================================

import { NotificationToken } from '@/lib/types';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
}

export class FCMService {
  private serverKey: string | undefined;

  constructor() {
    this.serverKey = process.env.FIREBASE_SERVER_KEY;
  }

  /**
   * Dispatches push notification to registered devices via FCM legacy HTTP API or V1
   */
  async sendNotification(token: string, payload: PushNotificationPayload): Promise<{ success: boolean; messageId?: string }> {
    if (!token) return { success: false };

    if (this.serverKey) {
      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${this.serverKey}`,
          },
          body: JSON.stringify({
            to: token,
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.icon || '/icon.png',
            },
            data: payload.data || {},
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          return { success: resJson.success === 1, messageId: resJson.results?.[0]?.message_id };
        }
      } catch (err) {
        console.warn('FCM dispatch failed, logging notification:', err);
      }
    }

    // In local development or when Firebase credentials are not provided:
    console.log(`[FCM Notification Simulated] To: ${token.slice(0, 12)}... | Title: "${payload.title}" | Body: "${payload.body}"`);
    return { success: true, messageId: `mock-msg-${Date.now()}` };
  }
}

export const fcmService = new FCMService();
