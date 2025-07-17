"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 5000);
  };

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="toast toast-bottom toast-end z-[100]">
          <div
            className={`alert ${getAlertClass(
              notification.type
            )} shadow-lg rounded-box flex items-center`}
          >
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <span className="flex-grow">{notification.message}</span>
            <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-info";
  }
}

function getIcon(type: NotificationType): ReactNode {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-6 h-6" />;
    case "error":
      return <XCircle className="w-6 h-6" />;
    case "warning":
      return <AlertCircle className="w-6 h-6" />;
    case "info":
      return <Info className="w-6 h-6" />;
    default:
      return <Info className="w-6 h-6" />;
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
