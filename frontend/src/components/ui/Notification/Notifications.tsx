import {
  CheckCircleIcon as SuccessIcon,
  ExclamationTriangleIcon as ErrorIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { observer } from "mobx-react-lite";
import { notificationService } from "../../../service/NotificationService";

const Notifications = observer(function Notifications() {
  const notifications = notificationService.notifications;

  function close(id: string) {
    return () => {
      notificationService.removeNotification(id);
    };
  }

  return (
    <div className="fixed top-0 right-0 m-8 z-[52]">
      {notifications.map((notification) => (
        <div
          key={`notification-${notification.id}`}
          className="flex items-start my-4 shadow-xl border border-gray-300 p-4 relative rounded-lg min-w-80 max-w-[450px] bg-gray-100"
        >
          <div className="flex items-center">
            {notification.type === "error" ? (
              <ErrorIcon className="w-7 h-7 text-red-500" />
            ) : (
              <SuccessIcon className="w-7 h-7 text-green-500" />
            )}
          </div>
          <div className="p-2 dark:text-green-200">
            <p className="font-semibold">{notification.title}</p>
            <p className="mt-2 break-words">{notification.message}</p>
          </div>
          <div className="w-10">
            <button
              className="absolute top-1 right-1 m-2 dark:hover:bg-neutral-100 dark:hover:dark:hover:bg-gray-200 rounded-full shadow p-2"
              onClick={close(notification.id)}
            >
              <XMarkIcon className="w-6 h-6  cursor-pointer" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Notifications;
