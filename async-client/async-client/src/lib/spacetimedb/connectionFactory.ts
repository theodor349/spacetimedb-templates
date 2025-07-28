'use client'

import {DbConnection} from '@/module_bindings';
import {
  onConnect,
  onConnectError,
  onDisconnect
} from "@/lib/spacetimedb/connectionHandlers";
import {
  cleanupConnectionListener
} from "@/lib/spacetimedb/connectionEvents";
import {
  cleanupSubscriptionListener
} from "@/lib/spacetimedb/subscriptionEvents";

let singletonConnection: DbConnection | null = null;
let connectionPromise: Promise<DbConnection> | null = null;

export const getDbConnection = async (): Promise<DbConnection> => {
  const isSSR = typeof window === 'undefined';
  if (isSSR) {
    throw new Error('Cannot use SpacetimeDB on the server.');
  }

  if (singletonConnection) {
    return singletonConnection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = buildDbConnection();
  singletonConnection = await connectionPromise;
  connectionPromise = null;

  return singletonConnection;
};

const buildDbConnection = async () => {
  console.log('[SpacetimeDB] Building connection...');
  return DbConnection.builder()
  .withUri('ws://localhost:3000')
  .withModuleName('quickstart-chat')
  .withToken(await getAuthToken())
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError)
  .build();
}

const getAuthToken = async () => {
  // Simulate obtaining of token
  await new Promise(resolve => setTimeout(resolve, 2000));
  return "";
}

export const disconnectDbConnection = () => {
  if (singletonConnection) {
    console.log('[SpacetimeDB] Disconnecting...');
    singletonConnection.disconnect();
    singletonConnection = null;
  }
  cleanupConnectionListener();
  cleanupSubscriptionListener();
};
