import { makeAutoObservable } from "mobx";

export type NotificationType = "success" | "error";

export interface Notification {
  id: string;
  message: string;
  title: string;
  type: NotificationType;
}

class NotificationService {
  notifications: Notification[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  addNotification(
    title: string,
    message: string,
    type: NotificationType = "success"
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    this.notifications.push({ message, title, id, type });
    setTimeout(() => {
      this.removeNotification(id);
    }, 7500);
  }

  removeNotification(id: string) {
    const index = this.notifications.findIndex(
      (notification) => notification.id === id
    );
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
}

export const notificationService = new NotificationService();
