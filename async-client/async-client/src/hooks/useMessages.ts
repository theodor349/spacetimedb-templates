import {useEffect, useSyncExternalStore} from "react";
import { messageStore } from "@/stores/messageStore";
import {useSpacetimeDB} from "@/contexts/spacetimeDB/spacetimeDBHooks";

export function useMessages() {
  const client = useSpacetimeDB();

  // Ensure the store has access to the initialized client
  // This useEffect will only run when client is guaranteed to be available
  useEffect(() => {
    messageStore.setClient(client);
  }, [client]);

  const messages = useSyncExternalStore(
    (callback) => messageStore.subscribe(callback),
    () => messageStore.getSnapshot(),
    () => messageStore.getServerSnapshot()
  );
  return messages;
}
