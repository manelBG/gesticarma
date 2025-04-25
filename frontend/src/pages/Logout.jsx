import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token ou les infos user ici
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return <div>Déconnexion en cours...</div>;
}
