import {useMessages} from "@/hooks/useMessages";

export const DataPreloader = ({ children }: { children: React.ReactNode }) => {
  // These hooks preload data from SpacetimeDB
  useMessages()

  return <>{children}</>;
};