type SubscriptionEvent = {
  success: boolean;
  error: Error | null;
}

const listeners = new Set<(event: SubscriptionEvent) => void>();
export const onSubscriptionChange = (callback: (event: SubscriptionEvent) => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const notifySubscriptionApplied = () => {
  listeners.forEach(callback => callback({success: true, error: null}));
};
export const notifySubscriptionError = (error: Error) => {
  listeners.forEach(callback => callback({success: true, error: error}));
};

export const cleanupSubscriptionListener = () => {
  listeners.clear();
}
