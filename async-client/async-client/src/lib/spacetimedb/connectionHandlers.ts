import {
  DbConnection,
  type ErrorContext,
  RemoteReducers,
  RemoteTables,
  SetReducerFlags
} from '@/module_bindings';
import {
  ErrorContextInterface,
  Identity
} from '@clockworklabs/spacetimedb-sdk';
import {
  notifyConnectionDisconnected,
  notifyConnectionError,
  notifyConnectionEstablished
} from '@/lib/spacetimedb/connectionEvents';
import {
  notifySubscriptionApplied,
  notifySubscriptionError
} from '@/lib/spacetimedb/subscriptionEvents';

export const onConnect = (
  conn: DbConnection,
  identity: Identity,
  token: string) => {
  console.log('[SpacetimeDB] Connection established.');
  localStorage.setItem('auth_token', token);

  notifyConnectionEstablished();
  subscribeToQueries(conn, ['SELECT * FROM user', 'SELECT * FROM message'])
};

export const onDisconnect = () => {
  console.warn('[SpacetimeDB] Disconnected.');
  notifyConnectionDisconnected();
};

export const onConnectError = (ctx: ErrorContext, error: Error) => {
  console.error('[SpacetimeDB] Connection Error:', error);
  notifyConnectionError(error);
};

export const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
  conn
  ?.subscriptionBuilder()
  .onApplied(() => {
    console.log('[SpacetimeDB] Subscribed to queries.');
    notifySubscriptionApplied();
  })
  .onError((ctx: ErrorContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>) => {
    console.error('[SpacetimeDB] Error subscribing to SpacetimeDB ' + ctx.event)
    notifySubscriptionError(ctx.event instanceof Error ? ctx.event : new Error(String(ctx.event)));
  })
  .subscribe(queries);
};
