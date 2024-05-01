import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { observer } from "mobx-react-lite";
import { chatService } from "../../service/ChatService";

export const Events = observer(function Events() {
  const messageContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full">
        <div
          className="flex flex-col text-sm pb-20"
          id="pippo"
          ref={messageContainer}
        >
          {chatService.messages.map((message) => (
            <ChatMessage
              key={`message-${message.id}`}
              from={message.from}
              message={message.message}
              id={message.id}
            />
          ))}
          {chatService.loading && <ChatMessage from="ai" loading />}
        </div>
      </div>
    </div>
  );
});
