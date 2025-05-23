import { useEffect, useState } from 'react';
import { Car, ClipboardList, Wrench, Settings2, PackageCheck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#f59e0b', '#10b981', '#ef4444'];

export default function TechAccueil() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);

      setChartData([
        { mois: 'Jan', interventionsInternes: 5, interventionsExternes: 3 },
        { mois: 'Fév', interventionsInternes: 6, interventionsExternes: 4 },
        { mois: 'Mar', interventionsInternes: 10, interventionsExternes: 5 },
        { mois: 'Avr', interventionsInternes: 11, interventionsExternes: 7 }
      ]);
    };

    const setGreetingMessage = () => {
      const hour = new Date().getHours();
      let message = '';

      if (hour >= 5 && hour < 12) {
        message = 'Bonjour';
      } else if (hour >= 12 && hour < 18) {
        message = 'Bon après-midi';
      } else {
        message = 'Bonsoir';
      }

      setGreeting(message);
    };

    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentTime(now.toLocaleDateString('fr-FR', options));
    };
    fetchStats();
    setGreetingMessage();
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="p-8 space-y-11">
      <div className="bg-white rounded-3xl shadow-lg p-10 space-y-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-gray-800 font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>
            {greeting} cher Technicien
          </h2>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">{currentTime}</span>
            </Button>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-medium">Voici un aperçu de vos activités techniques dans le parc</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard icon={Car} label="Véhicules" value={stats?.totalVehicules || 0} to="/vehicules" />
          <DashboardCard icon={PackageCheck} label="Fournitures" value={stats?.totalFournitures || 0} to="/fournitures" />
          <DashboardCard icon={ClipboardList} label="Missions" value={stats?.totalMissions || 0} to="/missions" />
          <DashboardCard icon={Wrench} label="Interventions Internes" value={stats?.totalInterventions || 0} to="/interventions/interne" />
          <DashboardCard icon={Settings2} label="Interventions Externes" value={stats?.totalInterventionsExternes || 0} to="/interventions/externe" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl shadow-inner p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Activité technique mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                   <XAxis dataKey="mois" />
                   <YAxis />
                   <Tooltip />
                   <Legend /> {/* Voici la légende */}
                     <Bar dataKey="interventionsInternes" fill="#60a5fa" radius={[10, 10, 0, 0]} name="Interventions Internes" />
                     <Bar dataKey="interventionsExternes" fill="#f59e0b" radius={[10, 10, 0, 0]} name="Interventions Externes" />
                 </BarChart>
          </ResponsiveContainer>

          </div>
          <div className="bg-gray-50 rounded-xl shadow-inner p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-6">Répartition des interventions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Internes', value: stats?.totalInterventions || 0, color: '#60a5fa' },
                    { name: 'Externes', value: stats?.totalInterventionsExternes || 0, color: '#f59e0b' }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#60a5fa" />
                  <Cell fill="#f59e0b" />
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
