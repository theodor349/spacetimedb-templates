'use client'

import {useMessages} from "@/hooks/useMessages";
import {useConnection} from "@/hooks/useConnection";
import {messageStore} from "@/stores/messageStore";

export  default function MessageList() {
  const connection = useConnection();
  const allMessages = useMessages();

  if(connection.error)
    return <div>Error: {connection.error.message}</div>;

  if(!connection.isConnected || !connection.isSubscribed)
    return <div>Not connected</div>;

  return (
    <div>
      <button className={"border p-2"} onClick={() => messageStore.sendMessage("Message")}>
        Send Message
      </button>
      <h1 className={"text-xl"}>Messages</h1>
      {allMessages.map(message => (
        <div key={message.sent.toDate().toISOString()}>
          {message.sent.toDate().toISOString()} - {message.text}
        </div>
      ))}
    </div>
  );
}