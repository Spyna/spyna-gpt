import Notifications from "./components/ui/Notification/Notifications";
import SocketApp from "./components/Socket/SocketApp";
import { ConnectionState } from "./components/Socket/components/ConnectionState";
import { Events } from "./components/Chat/Messages";
import { ChatForm } from "./components/Chat/ChatForm";
import Emebedder from "./components/Embedder/Embedder";

function App() {
  return (
    <>
      <SocketApp />
      <header className="flex items-center justify-between mb-8 p-2 shadow-xl bg-gray-200">
        <h1 className="text-xl">Spina Gpt</h1>
        <ConnectionState />
      </header>
      <main className="max-w-5xl mx-auto py-8">
        <div className="h-full">
          <div className="flex h-full flex-col"></div>
          <Events />
          <ChatForm />
          <Emebedder />
        </div>
      </main>
      <Notifications />
    </>
  );
}

export default App;
