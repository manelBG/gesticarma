import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { getUserNotifications } from "../redux/notificationSlice/notificationSlice";
import io from "socket.io-client";

const NotificationsPage = () => {
  // Outside the component — only one socket instance for the whole module
  const socket = io("http://localhost:5000", { autoConnect: false });

  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.notification || {});
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  console.log(notifications);
  // Load old notifications
  useEffect(() => {
    if (user) {
      dispatch(getUserNotifications({ destinataireId: user._id }));
    }
  }, [dispatch, user]);

  // Update local state when Redux list updates
  useEffect(() => {
    if (list.length > 0) {
      const sorted = [...list].sort(
        (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
      );
      setNotifications(sorted);
    }
  }, [list]);

  // Real-time updates via socket
  useEffect(() => {
    if (!user?._id) return;

    // Create socket connection when user is available
    socket.connect();
    socket.emit("join", user._id);

    // Define the notification handler inside the useEffect
    const handleNotification = (data) => {
      console.log("📩 Realtime notification received:", data);

      // Prevent adding duplicate notifications based on _id
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === data._id);
        if (exists) return prev; // Prevent adding if it already exists

        return [data, ...prev]; // Add the new notification to the state
      });
    };

    // Listen to the 'receive-notification' event from the server
    socket.on("receive-notification", handleNotification);

    // Clean up: Disconnect socket and remove the listener when the component unmounts or user._id changes
    return () => {
      socket.off("receive-notification", handleNotification); // Remove listener
      socket.disconnect(); // Disconnect socket
    };
  }, [user?._id]); // Dependency array: re-run the effect if user._id changes

  const prioritaire = notifications.filter((n) => n.sousType === "urgente");
  const generales = notifications.filter((n) => n.sousType !== "urgente");

  return (
    <div className="min-h-screen bg-gray-100 py-15 px-1 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-7xl">
        <h1 className="text-5xl md:text-6xl text-center text-gray-800 font-pacifico mb-12">
          Les Notifications
        </h1>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Urgent Notifications */}
          <div className="flex-1 bg-red-100 border-l-8 border-red-500 rounded-2xl shadow-lg p-8 min-h-[300px]">
            <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
              ⚠️ Notifications Prioritaires
            </h2>
            {generales.length > 0 ? (
              [...generales].map((notif) => (
                <div
                  key={notif._id}
                  className="bg-white p-4 rounded-lg shadow mb-4"
                >
                  <h3 className="font-semibold text-red-600">
                    {notif.sousType}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                  <span className="text-xs text-gray-500 block mt-2">
                    {new Date(notif.dateCreation).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">
                Aucune notification urgente.
              </p>
            )}
          </div>
          {/* General Notifications */}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
