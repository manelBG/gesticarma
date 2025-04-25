import { useAuth } from "../hooks/useAuth";

import TechAccueil from "./TechAccueil";
import EmployeeAccueil from "./EmployeeAccueil";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Chargement...</p>;

  if (user.role === "Directeur") return <AdminAccueil />;
  if (user.role === "Technicien") return <TechAccueil />;
  if (user.role === "Employee") return <EmployeeAccueil />;

  return <div>Non autorisé</div>;
}
