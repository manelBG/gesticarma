import { useState, useEffect } from "react";
import {
  Bell,
  User,
  LogOut,
  Users,
  Wrench,
  BarChart2,
  Car,
  ClipboardList,
  MapPin,
  Layers,
  Box,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "../utils/utils";
import { Tooltip } from "../components/ui/tooltip";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import io from "socket.io-client";

function GesticarmaLogo({ className }) {
  return (
    <img className={className} src="/images/logo.jpg" alt="Gesticar Logo" />
  );
}

function SideItem({ icon: Icon, label, path, active }) {
  return (
    <Link
      to={path || "#"}
      className={cn(
        "flex items-center px-4 py-1 text-blue-900 hover:bg-blue-50 cursor-pointer gap-3 transition-colors duration-200 rounded-md my-0.5 relative group",
        active && "bg-blue-50 font-medium"
      )}
    >
      <Icon
        className={cn("w-5 h-5", active ? "text-blue-600" : "text-blue-400")}
      />
      <span className="text-sm font-medium">{label}</span>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-md" />
      )}
    </Link>
  );
}

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0); // State to store notifications count
  console.log(notificationCount, "notificationCount");
  const [notifications, setNotifications] = useState([]); // To store the list of notifications (optional)
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean);
  const currentPage = path.length ? path[path.length - 1] : "Accueil";
  console.log(user, "user");
  const socket = io("http://localhost:5000");

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("join", user._id);

    const handleNotification = (data) => {
      console.log("📩 Realtime notification receivedddddddd:", data);

      setNotifications((prev) => {
        const exists = prev.find((n) => n._id === data._id);
        if (exists) return prev;

        // Only increment if it's a new notification
        setNotificationCount((prevCount) => prevCount + 1);
        return [...prev, data];
      });
    };

    socket.on("receive-notification", handleNotification);

    return () => {
      socket.off("receive-notification", handleNotification);
    };
  }, [socket]);

  const handleViewNotifications = () => {
    // Reset the unread notifications count when the user views them
    setNotificationCount(0);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setTimeout(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setUser(storedUser);
          } else {
            navigate("/login");
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setTimeout(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setUser(storedUser);
          } else {
            navigate("/login");
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const isActive = (path) => window.location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const userImage =
    user?.genre === "male"
      ? "/images/user-male.jpg"
      : "/images/user-femmale.jpg";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans transition-colors duration-200">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "bg-white text-blue-900 w-64 shadow-lg flex flex-col z-50",
          "fixed h-full overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <GesticarmaLogo className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-pacifico text-blue-900">GestiCarma</h1>
          </div>
          <button
            className="md:hidden text-blue-500 hover:text-blue-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center px-4 py-3">
          <div className="relative">
            <img
              src={userImage || "/placeholder.svg"}
              alt={user.prenom}
              className="w-10 h-10 rounded-full border-2 border-blue-100 cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <p
              className="text-sm font-medium text-blue-900 cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user.prenom}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

          {showUserMenu && (
            <div className="absolute right-2 top-16 bg-white shadow-md rounded-md w-40 border z-50">
              <ul className="text-sm text-blue-900">
                <li
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ACCUEIL */}
        <div className="text-xs uppercase px-4 pt-4 pb-1 text-gray-700 tracking-widest">
          — ACCUEIL
        </div>
        <div className="px-2">
          {user.role === "admin" && (
            <SideItem
              icon={Home}
              label="Accueil"
              path="/AdminAccueil"
              active={isActive("/AdminAccueil")}
            />
          )}
          {user.role === "employee" && (
            <SideItem
              icon={Home}
              label="Accueil"
              path="/employeeaccueil"
              active={isActive("/employeeaccueil")}
            />
          )}
          {user.role === "technicien" && (
            <SideItem
              icon={Home}
              label="Accueil"
              path="/techaccueil"
              active={isActive("/techaccueil")}
            />
          )}
        </div>

        <div className="px-2">
          {user.role === "admin" && (
            <>
              <div className="text-xs uppercase px-2 pt-3 pb-2 text-gray-700 tracking-widest">
                — UTILISATEURS
              </div>
              <SideItem
                icon={Users}
                label="Employés"
                path="/employes"
                active={isActive("/employes")}
              />
              <SideItem
                icon={Wrench}
                label="Techniciens"
                path="/techniciens"
                active={isActive("/techniciens")}
              />
            </>
          )}

          {(user.role === "admin" || user.role === "technicien") && (
            <>
              <div className="text-xs uppercase px-2 pt-4 pb-2 text-gray-700 tracking-widest">
                — PARC DE VÉHICULES
              </div>
              <SideItem
                icon={Car}
                label="Véhicules"
                path="/vehicules"
                active={isActive("/vehicules")}
              />
            </>
          )}

          {(user.role === "admin" || user.role === "technicien") && (
            <>
              <div className="text-xs uppercase px-2 pt-4 pb-2 text-gray-700 tracking-widest">
                — INTERVENTIONS
              </div>
              <SideItem
                icon={Wrench}
                label="Interne"
                path="/interventions/interne"
                active={isActive("/interventions/interne")}
              />
              {(user.role === "admin" ||
                user.role === "technicien") && (
                  <SideItem
                    icon={Wrench}
                    label="Archived Interne"
                    path="/interventions/archived"
                    active={isActive("/interventions/archived")}
                  />
                )}
              <SideItem
                icon={Layers}
                label="Externe"
                path="/interventions/externe"
                active={isActive("/interventions/externe")}
              />
              <SideItem
                icon={Layers}
                label="Archived Externe"
                path="/interventions/externe/archived"
                active={isActive("/interventions/externe/archived")}
              />
              <SideItem
                icon={Box}
                label="Fournitures"
                path="/fournitures"
                active={isActive("/fournitures")}
              />
            </>
          )}

          {(user.role === "admin" ||
            user.role === "employee" ||
            user.role === "technicien") && (
            <>
              <div className="text-xs uppercase px-2 pt-4 pb-2 text-gray-700 tracking-widest">
                — MISSIONS
              </div>
              <SideItem
                icon={ClipboardList}
                label="Missions"
                path="/missions"
                active={isActive("/missions")}
              />
              <SideItem
                icon={MapPin}
                label="Plan"
                path="/plan"
                active={isActive("/plan")}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 ml-64">
        <div
          className="flex justify-end items-center px-4 py-4 border-b"
          style={{ backgroundColor: "#1E40AF" }}
        >
          <div className="flex items-center space-x-4">
            <Tooltip content="Notifications">
              <Link to="/notifications" onClick={handleViewNotifications}>
                <div className="relative">
                  <Bell className="w-5 h-5 text-white" />
                  {notificationCount > 0 && (
                    <>
                      <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full" />
                    </>
                  )}
                </div>
              </Link>
            </Tooltip>
            <Tooltip content="Compte utilisateur">
              <Link to="/profile">
                <User className="w-5 h-5 text-white" />
              </Link>
            </Tooltip>
            <Tooltip content="Déconnexion">
              <LogOut
                className="w-5 h-5 text-white cursor-pointer"
                onClick={handleLogout}
              />
            </Tooltip>
          </div>
        </div>

        {/* Breadcrumb + Contenu */}
        <Breadcrumb
          currentPage={
            currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
          }
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
