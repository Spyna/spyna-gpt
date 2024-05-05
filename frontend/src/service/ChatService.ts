import { makeAutoObservable } from "mobx";
import { Events, webSocketService } from "./WebSocketService";

export type From = "user" | "ai";

export interface ChatResponse {
  content: string;
  sources: string[];
}

export interface ChatMessage {
  from: From;
  message: ChatResponse | string;
  date: Date;
  id: string;
}

class ChatService {
  constructor() {
    makeAutoObservable(this);
  }
  loading: boolean = false;
  messages: ChatMessage[] = [
    // {
    //   date: new Date(),
    //   from: "ai",
    //   id: randomId(),
    //   message: {
    //     content: `1. **Scheduled Meetings and Touchpoints**:\n   - Scrum provides pre-scheduled meetings and touchpoints with the team, making planning easier.\n   - Kanban does not define any specific meetings or roles, allowing more flexibility in how work is managed.\n\n2. **Roles**:\n   - Scrum has specific roles like ScrumMaster and Product Owner, which are crucial for the framework.\n   - Kanban does not have defined roles beyond the development team, giving more autonomy to team members.\n\n3. **Meeting Types**:\n   - Scrum meetings generally fall into categories like just-in-time meetings, asynchronous cadences, and cadences synchronized with other teams.\n   - Kanban teams often adopt meetings from other agile methods, adapting to their specific needs.\n\n4. **Cadences**:\n   - Scrum meetings are typically scheduled in advance and follow a set cadence.\n   - Kanban teams have more flexibility in scheduling meetings and events based on their workflow and requirements.\n\n5. **Planning Approach**:\n   - Scrum focuses on sprint planning and backlog refinement meetings to make product decisions.\n   - Kanban emphasizes continuous flow and limiting work in progress without specific planning meetings.\n\n6. **Framework Support**:\n   - Scrum provides a structured framework with defined roles and ceremonies.\n   - Kanban offers a more flexible approach with fewer constraints, allowing teams to adapt their processes more freely.\n\n7. **Responsibilities**:\n   - In Scrum, roles like ScrumMaster and Product Owner have specific responsibilities.\n   - Kanban promotes shared responsibilities among team members without designated roles beyond the development team.`,
    //     sources: [],
    //   },
    // },
  ];

  addMessage(message: ChatResponse, from: From) {
    this.messages.push({ message, from, date: new Date(), id: randomId() });
    this.loading = false;
  }

  ask(question: string) {
    this.loading = true;
    webSocketService.emit(Events.events, { query: question });
    this.messages.push({
      message: question,
      from: "user",
      date: new Date(),
      id: randomId(),
    });
  }
}

export const chatService = new ChatService();

function randomId() {
  return Math.random().toString(16);
}
