import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { getUserNotifications } from "../redux/notificationSlice/notificationSlice";
import io from "socket.io-client";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((state) => state.notification || {});
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const socket = io("http://localhost:5000");

  // Load old notifications
  useEffect(() => {
    if (user) {
      dispatch(getUserNotifications({ destinataireId: user._id }));
    }
  }, [dispatch, user]);

  // Update local state when Redux list updates
  useEffect(() => {
    if (list.length > 0) {
      setNotifications(list);
    }
  }, [list]);

  // Real-time updates via socket
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("join", user._id);

    const handleNotification = (data) => {
      console.log("📩 Realtime notification received:", data);
      setNotifications((prev) => {
        const exists = prev.find((n) => n._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive-notification", handleNotification);

    return () => {
      socket.off("receive-notification", handleNotification);
    };
  }, [socket, user]);

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
            {prioritaire.length > 0 ? (
              prioritaire.map((notif) => (
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
          <div className="flex-1 bg-blue-100 border-l-8 border-blue-500 rounded-2xl shadow-lg p-8 min-h-[300px]">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              ℹ️ Notifications Générales
            </h2>
            {generales.length > 0 ? (
              generales.map((notif) => (
                <div
                  key={notif._id}
                  className="bg-white p-4 rounded-lg shadow mb-4"
                >
                  <h3 className="font-semibold text-blue-700">
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
                Pas de notification générale.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
