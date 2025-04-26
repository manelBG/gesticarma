import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const { user } = useAuth();
  const location = useLocation();

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

  // Décompose le pathname en segments : /employes/ajouter → ["employes", "ajouter"]
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // On ignore les pages d'accueil pour ne pas les afficher deux fois
  const accueilPages = [
    "AdminAccueil",
    "adminaccueil",
    "employeeaccueil",
    "technicienaccueil",
    "techaccueil",
    "employee",
    "Accueil",
  ];

  // Construit les liens intermédiaires
  const buildPath = (index) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="bg-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-end">
        <div className="flex space-x-2 items-center">
          <Link
            to={getHomePath()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Accueil
          </Link>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);

            if (accueilPages.includes(segment)) return null;

            return (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-400">→</span>
                {isLast ? (
                  <span className="text-sm font-medium text-green-500">{formatted}</span>
                ) : (
                  <Link
                    to={buildPath(index)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    {formatted}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
