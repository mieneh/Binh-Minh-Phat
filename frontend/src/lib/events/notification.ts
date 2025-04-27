export const NOTIFICATION_UPDATED = "notification-updated";

export const emitNotificationUpdated = () => {
  window.dispatchEvent(new Event(NOTIFICATION_UPDATED));
};
