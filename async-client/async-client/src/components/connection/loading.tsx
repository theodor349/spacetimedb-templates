import React from 'react';

export function SpacetimeDBLoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <h2 className="mt-6 text-xl font-medium">Initializing database connection...</h2>
      <p className="mt-2 text-muted-foreground">Please wait while we set things up</p>
    </div>
  );
}
