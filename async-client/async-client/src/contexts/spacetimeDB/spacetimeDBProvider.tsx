'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { DbConnection } from '@/module_bindings';
import { getDbConnection, disconnectDbConnection } from '@/lib/spacetimedb/connectionFactory';
import { SpacetimeDBLoadingScreen } from '@/components/connection/loading';
import {SpacetimeDBErrorScreen} from "@/components/connection/error";
import {onSubscriptionApplied, onSubscriptionError} from "@/lib/spacetimedb/subscriptionEvents";
import {DataPreloader} from "@/contexts/spacetimeDB/dataPreloader";
import { InitStatusContext, SpacetimeDBContext } from './spacetimeDBContexts';
import { onConnectionDisconnected, onConnectionError} from "@/lib/spacetimedb/connectionEvents";

type SpacetimeDBProviderProps = {
  children: ReactNode;
};

export function SpacetimeDBProvider({ children }: SpacetimeDBProviderProps) {
  const [client, setClient] = useState<DbConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeClient = async () => {
      try {
        if (isMounted) setIsLoading(true);
        const dbConnection = await getDbConnection();

        if (isMounted) {
          setClient(dbConnection);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setIsLoading(false);
          console.error('[SpacetimeDB] Initialization error:', e);
        }
      }
    };

    onConnectionDisconnected(() => {
      if(!isMounted) return;
      setClient(null);
      setIsLoading(false);
      setError(new Error('Disconnected from SpacetimeDB.'));
    });
    onConnectionError((error) => {
      if(!isMounted) return;
      setClient(null);
      setIsLoading(false);
      setError(error);
    })

    onSubscriptionApplied(() => {
      if(!isMounted) return;
      setIsLoading(false);
    })
    onSubscriptionError((error) => {
      if(!isMounted) return;
      setIsLoading(false);
      setError(error);
    })

    initializeClient();

    return () => {
      isMounted = false;
      disconnectDbConnection();
    };
  }, []);

  if (isLoading) {
    return (
      <InitStatusContext.Provider value={{ isLoading, error }}>
        <SpacetimeDBLoadingScreen />
      </InitStatusContext.Provider>
    );
  }

  if (error) {
    return (
      <InitStatusContext.Provider value={{ isLoading, error }}>
        <SpacetimeDBErrorScreen error={error}/>
      </InitStatusContext.Provider>
    );
  }

  if (!client) {
    // This should technically never happen since we check isLoading and error first
    return (
      <InitStatusContext.Provider value={{ isLoading, error }}>
        <div>Unexpected state: Client not available but not loading or error</div>
      </InitStatusContext.Provider>
    );
  }

  // If we reach here, we definitely have a client
  return (
    <InitStatusContext.Provider value={{ isLoading, error }}>
      <SpacetimeDBContext.Provider value={{ client }}>
        <DataPreloader> {/* Initiate all data stores */}
          {children}
        </DataPreloader>
      </SpacetimeDBContext.Provider>
    </InitStatusContext.Provider>
  );
}
