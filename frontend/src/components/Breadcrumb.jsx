import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";


const Breadcrumb = ({ currentPage = "Accueil" }) => {
  const { user } = useAuth(); // <--- ici on récupère "user" pas "auth"

  const getHomePath = () => {
    switch (user?.role) {
      case "admin":
        return "/AdminAccueil";
      case "technicien":
        return "/techaccueil";
      case "employee":
        return "/employeeaccueil";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-end">
        <div className="flex space-x-2 items-center">
          <Link to={getHomePath()} className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Accueil
          </Link>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-sm font-medium text-green-500">
            {currentPage}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
