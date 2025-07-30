import {Message, DbConnection} from "@/module_bindings";

class MessageStore {
  private listeners: Set<() => void> = new Set();
  private connection: DbConnection | null = null;
  private cachedSnapshot: Message[] = [];
  private serverSnapshot: Message[] = [];

  private isInitialized = false;

// Only invoked by the hook
  public setClient(client: DbConnection) {
    if (!this.connection || this.connection !== client) {
      this.connection = client;
      this.subscribeToTables(client);
      this.loadInitialSnapshot(client);
      this.isInitialized = true;
    }
  }

  private subscribeToTables(client: DbConnection) {
    client.db.message.onInsert((ctx, row) => this.updateSnapshot());
    client.db.message.onDelete((ctx, row) => this.updateSnapshot());
  }

  private loadInitialSnapshot(client: DbConnection) {
    this.cachedSnapshot = Array.from(client.db.message.iter());
    this.emitChange();
  }


  public subscribe(onStoreChange: () => void) {
    this.listeners.add(onStoreChange);
    return () => {
      // Cleanup on unmount
      this.listeners.delete(onStoreChange);
    };
  }

  public getSnapshot() {
    try {
      return this.cachedSnapshot;
    } catch (error) {
      const isNotSSR = typeof window !== 'undefined';
      if(isNotSSR) {
        console.error('Unexpected error while obtaining snapshot:', error);
      }
      return this.serverSnapshot;
    }
  }

  public getServerSnapshot() {
    // Return the same reference to prevent unnecessary SSR re-renders
    return this.serverSnapshot;
  }

  public sendMessage(newMessage: string){
    if (this.connection) {
      this.connection.reducers.sendMessage(newMessage);
    }
  }

  private updateSnapshot() {
    if (this.connection) {
      this.cachedSnapshot = Array.from(this.connection.db.message.iter());
      this.emitChange();
    }
  }

  private emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const messageStore = new MessageStore();