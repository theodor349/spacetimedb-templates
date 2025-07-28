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

export const getDbConnection = (): DbConnection => {
  const isSSR = typeof window === 'undefined';
  if (isSSR) {
    throw new Error('Cannot use SpacetimeDB on the server.');
  }

  if (singletonConnection) {
    return singletonConnection;
  }

  singletonConnection = buildDbConnection()
  return singletonConnection;
};

const buildDbConnection = () => {
  console.log('[SpacetimeDB] Building connection...');
  return DbConnection.builder()
  .withUri('ws://localhost:3000')
  .withModuleName('quickstart-chat')
  .withToken(getAuthToken())
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError)
  .build();
}

const getAuthToken = () => {
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
