import Notifications from "./component/ui/Notification/Notifications";
import SocketApp from "./component/Socket/SocketApp";

function App() {
  return (
    <>
      <header className="flex items-center justify-between mb-8 p-2 shadow-xl bg-gray-200">
        <h1 className="text-xl">Spina Gpt</h1>
      </header>
      <main className="max-w-5xl mx-auto py-8">
        <SocketApp />
      </main>
      <Notifications />
    </>
  );
}

export default App;
