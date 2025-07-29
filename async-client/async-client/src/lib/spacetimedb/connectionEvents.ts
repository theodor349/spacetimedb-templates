const connectionEstablishListeners = new Set<() => void>();
const connectionDisconnectedListeners = new Set<() => void>();
const connectionErrorListeners = new Set<(error: Error) => void>();


export const onConnectionEstablished = (callback: () => void) => {
  connectionEstablishListeners.add(callback);
  return () => connectionEstablishListeners.delete(callback);
};
export const onConnectionDisconnected = (callback: () => void) => {
  connectionDisconnectedListeners.add(callback);
  return () => connectionDisconnectedListeners.delete(callback);
};
export const onConnectionError = (callback: (error: Error) => void) => {
  connectionErrorListeners.add(callback);
  return () => connectionErrorListeners.delete(callback);
};


export const notifyConnectionEstablished = () => {
  connectionEstablishListeners.forEach(callback => callback());
};
export const notifyConnectionDisconnected = () => {
  connectionDisconnectedListeners.forEach(callback => callback());
};
export const notifyConnectionError = (error: Error) => {
  connectionErrorListeners.forEach(callback => callback(error));
};

export const cleanupConnectionListener = () => {
  connectionEstablishListeners.clear();
  connectionDisconnectedListeners.clear();
  connectionErrorListeners.clear();
}