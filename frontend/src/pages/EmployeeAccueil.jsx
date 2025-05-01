import { useEffect, useState } from "react";
import { ClipboardList, Calendar, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function EmployeeAccueil() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [missions, setMissions] = useState(0); // État pour les missions
  const [notifications, setNotifications] = useState([]); // État pour les notifications
  const { user, token } = useAuth();

  useEffect(() => {
    const getUserNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // Vérification que les notifications sont un tableau
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications); // Mise à jour des notifications
      } else {
        console.error("Les notifications doivent être un tableau", data);
        setNotifications([]); // Initialisation vide si données invalides
      }
    };

    console.log("ID employé utilisé :", user?._id);

    const fetchMissions = async () => {
      if (!user?._id || !token) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/missions/employee/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status, await res.text());
          setMissions(0);
          return;
        }

        const data = await res.json();
        console.log("Missions récupérées pour l'employé:", data);
        console.log("Taille du tableau :", data.length);

        if (Array.isArray(data)) {
          setMissions(data.length);
        } else {
          console.error("Réponse inattendue pour missions :", data);
          setMissions(0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des missions :", error);
        setMissions(0);
      }
    };

    const setGreetingMessage = () => {
      const hour = new Date().getHours();
      let message = "";

      if (hour >= 5 && hour < 12) {
        message = "Bonjour";
      } else if (hour >= 12 && hour < 18) {
        message = "Bon après-midi";
      } else {
        message = "Bonsoir";
      }

      setGreeting(message);
    };

    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentTime(now.toLocaleDateString("fr-FR", options));
    };

    getUserNotifications(); // Récupérer les notifications
    fetchMissions(); // Récupérer les missions de l'employé
    setGreetingMessage();
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    return () => clearInterval(timeInterval);
  }, []); // Cette dépendance vide permet de charger les données au premier rendu du composant

  return (
    <div className="p-8 space-y-11">
      <div className="bg-white rounded-3xl shadow-lg p-10 space-y-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h2
            className="text-3xl text-gray-800 font-bold"
            style={{ fontFamily: "Pacifico, cursive" }}
          >
            {greeting} cher Employé
          </h2>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">{currentTime}</span>
            </Button>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-medium">
          Voici un aperçu de vos missions{" "}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            icon={ClipboardList}
            label="Missions"
            value={missions}
            to="/missions"
          />
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center space-y-2 text-blue-900">
            <div className="text-xl font-bold">{notifications.length}</div>
            <div className="text-sm">Notifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-2 text-blue-900"
    >
      <Icon className="w-7 h-7 text-blue-600" />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </Link>
  );
}
