import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { socket } from "../../service/socketClient";
import { ChatResponse, chatService } from "../../service/ChatService";
import { notificationService } from "../../service/NotificationService";
import { webSocketService } from "../../service/WebSocketService";

const SocketApp = observer(function () {
  useEffect(() => {
    function onConnect() {
      webSocketService.setConnected(true);
    }

    function onDisconnect() {
      webSocketService.setConnected(false);
    }

    function onChatMessageReceived(value: ChatResponse) {
      chatService.addMessage(value, "ai");
    }

    function onEmbeddingFinished(value: string) {
      notificationService.addNotification("Embedding", value);
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
  return null;
});

export default SocketApp;
