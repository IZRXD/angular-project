import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info'; // Add more types if needed
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  showNotification(message: string, type: Notification['type']) {
    const notification: Notification = { message, type };
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
  }
}
