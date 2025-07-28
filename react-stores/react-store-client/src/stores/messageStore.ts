import {Message, DbConnection} from "@/module_bindings";
import {getDbConnection} from '@/lib/spacetimedb/connectionFactory';
import {onSubscriptionChange} from "@/lib/spacetimedb/subscriptionEvents";

class MessageStore {
  private listeners: Set<() => void> = new Set();
  private connection: DbConnection | null = null;
  private cachedSnapshot: Message[] = [];
  private serverSnapshot: Message[] = [];

  constructor() {
    onSubscriptionChange(() => {
      this.updateSnapshot();
    });
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
      this.getConnection();
      return this.cachedSnapshot;
    } catch (error) {
      const isNotSSR = typeof window !== 'undefined';
      if(isNotSSR) {
        // This would be an unexpected error on the client-side
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

  private getConnection(): DbConnection {
    if (!this.connection) {
      this.connection = getDbConnection();
      this.connection.db.message.onInsert((ctx, row) => this.updateSnapshot());
      this.connection.db.message.onDelete((ctx, row) => this.updateSnapshot());
    }
    return this.connection;
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