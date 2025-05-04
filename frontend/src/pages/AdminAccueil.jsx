import { useEffect, useState } from "react";
import {
  Car,
  Users,
  Wrench,
  ClipboardList,
  Calendar,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { getMissions } from "../redux/missionSlice/missionSlice";
import { useDispatch, useSelector } from "react-redux";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function AdminAccueil() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);

      setChartData([
        {
          mois: "Jan",
          missions: 12,
          interventionsInternes: 5,
          interventionsExternes: 3,
        },
        {
          mois: "Fév",
          missions: 18,
          interventionsInternes: 6,
          interventionsExternes: 4,
        },
        {
          mois: "Mar",
          missions: 25,
          interventionsInternes: 10,
          interventionsExternes: 5,
        },
        {
          mois: "Avr",
          missions: 20,
          interventionsInternes: 11,
          interventionsExternes: 7,
        },
      ]);

      setPieData([
        { name: "Disponibles", value: 10, color: "#10b981" },
        { name: "En mission", value: 12, color: "#3b82f6" },
        { name: "En maintenance", value: 5, color: "#f59e0b" },
        { name: "Hors service", value: 3, color: "#ef4444" },
      ]);
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

    fetchStats();
    setGreetingMessage();
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    return () => clearInterval(timeInterval);
  }, []);
  const { listMission, error, listMissionByUserId } = useSelector(
    (state) => state.missions
  );
  const missionCount = listMission?.length || 0;
console.log(missionCount, "missionCountmissionCount");
  useEffect(() => {
    dispatch(getMissions());
  }, [dispatch]);
  return (
    <div className="p-8 space-y-11">
      <div className="bg-white rounded-3xl shadow-lg p-10 space-y-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h2
            className="text-3xl text-gray-800 font-bold"
            style={{ fontFamily: "Pacifico, cursive" }}
          >
            {greeting} Monsieur le Directeur
          </h2>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">{currentTime}</span>
            </Button>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-medium">
          Voici un aperçu global de l'activité du parc automobile
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={Users}
            label="Employés"
            value={stats?.totalEmployees || 0}
            to="/employes"
          />
          <DashboardCard
            icon={Car}
            label="Véhicules"
            value={stats?.totalVehicules || 0}
            to="/vehicules"
          />
          <DashboardCard
            icon={ClipboardList}
            label="Missions"
            value={missionCount}
            to="/missions"
          />
          <DashboardCard
            icon={Users}
            label="Techniciens"
            value={stats?.totalTechniciens || 0}
            to="/techniciens"
          />
          <DashboardCard
            icon={Settings2}
            label="Interventions Internes"
            value={stats?.totalInterventions || 0}
            to="/interventions/interne"
          />
          <DashboardCard
            icon={Wrench}
            label="Interventions Externes"
            value={stats?.totalInterventionsExternes || 0}
            to="/interventions/externe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl shadow-inner p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Activité mensuelle : Missions & Interventions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="missions"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                  name="Missions"
                />
                <Bar
                  dataKey="interventionsInternes"
                  fill="#60a5fa"
                  radius={[10, 10, 0, 0]}
                  name="Interventions Internes"
                />
                <Bar
                  dataKey="interventionsExternes"
                  fill="#f59e0b"
                  radius={[10, 10, 0, 0]}
                  name="Interventions Externes"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700 justify-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span>
                <span>Missions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-300"></span>
                <span>Interventions Internes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                <span>Interventions Externes</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-inner p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-6">
              Répartition des véhicules
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  cx="50%" // Centre horizontal
                  cy="50%"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
