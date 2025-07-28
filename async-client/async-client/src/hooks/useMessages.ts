import { useSyncExternalStore } from "react";
import { messageStore } from "@/stores/messageStore";

export function useMessages() {
  const messages = useSyncExternalStore(
    (callback) => messageStore.subscribe(callback),
    () => messageStore.getSnapshot(),
    () => messageStore.getServerSnapshot()
  );
  return messages;
}
