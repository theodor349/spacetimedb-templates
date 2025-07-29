'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { DbConnection } from '@/module_bindings';
import { getDbConnection, disconnectDbConnection } from '@/lib/spacetimedb/connectionFactory';
import { SpacetimeDBLoadingScreen } from '@/components/connection/loading';
import {SpacetimeDBErrorScreen} from "@/components/connection/error";
import {onSubscriptionChange} from "@/lib/spacetimedb/subscriptionEvents";
import {DataPreloader} from "@/contexts/dataPreloader";
import { InitStatusContext, SpacetimeDBContext } from './spacetimeDBContexts';

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

    onSubscriptionChange((event) => {
      if(!isMounted) return;

      if(!event.success){
        if(error){
          console.error('[SpacetimeDB] Supscription failed.', event.error);
          setError(new Error('Multiple errors occurred. Please check the console for details.'));
        }
        else
          setError(event.error);
      }

      setIsLoading(false);
    });
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
