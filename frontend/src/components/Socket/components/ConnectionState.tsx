import { observer } from "mobx-react-lite";
import { webSocketService } from "../../../service/WebSocketService";

export const ConnectionState = observer(function ConnectionState() {
  const isConnected = webSocketService.connected;

  return (
    <div className="flex items-center text-sm">
      Connection status{" "}
      {isConnected ? (
        <Circle color="bg-green-400" />
      ) : (
        <Circle color="bg-red-500" />
      )}
    </div>
  );
});

function Circle({ color }: Readonly<{ color: string }>) {
  return (
    <div className={"ms-1 h-4 w-4 inline-block rounded-full " + color}></div>
  );
}
