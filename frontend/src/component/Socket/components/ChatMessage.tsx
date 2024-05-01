import {
  InformationCircleIcon,
  RocketLaunchIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "../../ui/Loader/Loader";
import MarkdownMessage from "./MarkdownMessage";
import { ChatResponse } from "../../../service/ChatService";
import { useState } from "react";

interface Props {
  from: "user" | "ai";
  message?: ChatResponse | string;
  loading?: boolean;
  id: string;
}

export default function ChatMessage({
  from,
  message,
  loading,
  id,
}: Readonly<Props>) {
  const fromAi = from === "ai";
  return (
    <div className="flex my-2">
      <div className="m-2">
        {fromAi && (
          <RocketLaunchIcon className="w-8 h-8 rounded-full text-blue-700 dark:text-blue-300" />
        )}
        {!fromAi && (
          <UserCircleIcon className="w-8 h-8 rounded-full text-blue-500 dark:text-blue-300" />
        )}
        <span className="text-sm font-semibold dark:text-white">
          {fromAi ? "AI" : "You"}
        </span>
      </div>
      <div className="flex flex-col gap-1 w-full bg-gray-100 rounded">
        <div className={"p-4 border-gray-200 rounded my-1"}>
          {message && (
            <div className={"dark:"}>
              <MarkdownMessage
                message={
                  typeof message === "string" ? message : message.content
                }
              />
            </div>
          )}
          {loading && <Loader />}
        </div>
        {message && typeof message !== "string" && (
          <div className="p-2">
            <Sources sources={message.sources} messageId={id} />
          </div>
        )}
      </div>
    </div>
  );
}

function Sources({
  sources,
  messageId,
}: Readonly<{ sources: string[]; messageId: string }>) {
  const [showSources, setShowSources] = useState(false);

  function toggleSources() {
    setShowSources((prev) => !prev);
  }

  return (
    <div className="relative text-base">
      <button className="bg-transparent" onClick={toggleSources}>
        <InformationCircleIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
      </button>
      {showSources && (
        <div className="shadow-xl border border-gray-800 absolute left-0 top-0 -translate-y-full p-3 bg-gray-100 rounded">
          <h3>Sources:</h3>
          <ul className="list-disc list-inside">
            {sources.map((source, index) => (
              <li key={`message-${messageId}-source-${index}`}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
