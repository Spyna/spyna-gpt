export interface ChatMessageType {
    data: string;
    from: "user" | "ai";
  }
export interface ServerMessageType {
    type: "embed" | "reply";
    data: string;
  }