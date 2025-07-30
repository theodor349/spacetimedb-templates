'use client';

import React from 'react';

interface SpacetimeDBErrorScreenProps {
  error: Error;
}

export function SpacetimeDBErrorScreen({error} : SpacetimeDBErrorScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <h2 className="text-xl font-medium text-destructive">Connection Error</h2>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  );
}
