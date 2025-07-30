import {DbConnection} from "@/module_bindings";
import {useContext} from "react";
import {InitStatusContext, SpacetimeDBContext} from "@/contexts/spacetimeDB/spacetimeDBContexts";

export const useSpacetimeDB = (): DbConnection => {
  const context = useContext(SpacetimeDBContext);
  if (!context) {
    throw new Error('useSpacetimeDB must be used within a SpacetimeDBProvider after initialization');
  }
  return context.client;
};

export const useSpacetimeDBStatus = () => useContext(InitStatusContext);
