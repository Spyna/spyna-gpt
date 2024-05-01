import React from "react";
import { observer } from "mobx-react-lite";
import { chatService } from "../../service/ChatService";

export const ChatForm = observer(function ChatForm() {
  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("chat") as string;
    if (message === "") {
      return;
    }
    chatService.ask(message);
  }

  return (
    <div className="fixed bottom-0 flex justify-between left-0 right-0 dark:bg-gray-200 shadow w-screen pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent bg-white">
      <form
        className="stretch mx-2 flex w-full flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        onSubmit={onFormSubmit}
      >
        <div className="relative flex w-full h-full flex-1 flex-col">
          <div className="absolute bottom-full left-0 right-0"></div>
          <div className="overflow-hidden flex flex-col w-full flex-grow relative border dark:rounded-2xl bg-token-main-surface-primary border-token-border-medium">
            <textarea
              id="prompt-textarea"
              tabIndex={0}
              rows={1}
              name="chat"
              placeholder="Ask me something..."
              className="m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4"
              style={{ height: 52, overflowY: "hidden" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && "form" in e.target) {
                  e.preventDefault();
                  (e.target.form as HTMLFormElement).requestSubmit();
                }
              }}
            ></textarea>
            <button
              disabled={chatService.loading}
              className="absolute bottom-1.5 right-2 rounded-lg border border-black bg-gray-800 p-0.5 transition-colors enabled:bg-black disabled:disabled:opacity-10 dark:border-white dark:dark:hover:md:bottom-3 md:right-3"
              data-testid="send-button"
            >
              <span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className=""
                >
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});
