type ConnectionEstablishedEvent = {
  type: 'established';
};

type ConnectionDisconnectedEvent = {
  type: 'disconnected';
};

type ConnectionErrorEvent = {
  type: 'error';
  error: Error;
};

type ConnectionEvent =
  | ConnectionEstablishedEvent
  | ConnectionDisconnectedEvent
  | ConnectionErrorEvent;

const listeners = new Set<(event: ConnectionEvent) => void>();
export const onConnectionChange = (callback: (event: ConnectionEvent) => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const notifyConnectionEstablished = () => {
  listeners.forEach(callback => callback({ type: 'established' }));
};
export const notifyConnectionDisconnected = () => {
  listeners.forEach(callback => callback({ type: 'disconnected' }));
};
export const notifyConnectionError = (error: Error) => {
  listeners.forEach(callback => callback({ type: 'error', error }));
};

export const cleanupConnectionListener = () => {
  listeners.clear();
}