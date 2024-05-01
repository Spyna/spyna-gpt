import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { Events } from "./components/Events";
import { ChatForm } from "./components/ChatForm";
import Emebedder from "../Embedder/Embedder";
import { ChatResponse, chatService } from "../../service/ChatService";
import { notificationService } from "../../service/NotificationService";

export default function SocketApp() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMessageReceived(value: ChatResponse) {
      chatService.addMessage(value, "ai");
    }

    function onEmbeddingFinished(value: string) {
      notificationService.addNotification(
        "Embedding finished",
        `Embedding finished for ${value}`
      );
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("events", onChatMessageReceived);
    socket.on("embedding", onEmbeddingFinished);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("events", onChatMessageReceived);
    };
  }, []);

  return (
    <div className="h-full">
      <div className="flex h-full flex-col"></div>
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      <Events />
      <ChatForm />
      <Emebedder />
    </div>
  );
}
