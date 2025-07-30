const onSubscriptionAppliedListeners = new Set<() => void>();
const onSubscriptionErrorListeners = new Set<(error: Error) => void>();

export const onSubscriptionApplied = (callback: () => void) => {
  onSubscriptionAppliedListeners.add(callback);
  return () => onSubscriptionAppliedListeners.delete(callback);
};
export const onSubscriptionError = (callback: (error: Error) => void) => {
  onSubscriptionErrorListeners.add(callback);
  return () => onSubscriptionErrorListeners.delete(callback);
};

export const notifySubscriptionApplied = () => {
  onSubscriptionAppliedListeners.forEach(callback => callback());
};
export const notifySubscriptionError = (error: Error) => {
  onSubscriptionErrorListeners.forEach(callback => callback(error));
};

export const cleanupSubscriptionListener = () => {
  onSubscriptionErrorListeners.clear();
}
