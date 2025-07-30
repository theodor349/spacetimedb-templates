import {createContext} from "react";
import {DbConnection} from "@/module_bindings";

// Two separate contexts with different states:

// 1. A context for initialization status
type InitStatusContextType = {
  isLoading: boolean;
  error: Error | null;
};
export const InitStatusContext = createContext<InitStatusContextType>({
  isLoading: true,
  error: null,
});



// 2. A context that only exists when client is available
type SpacetimeDBContextType = {
  client: DbConnection;
};
// This context is only created when DbConnection is available
export const SpacetimeDBContext = createContext<SpacetimeDBContextType | null>(null);
