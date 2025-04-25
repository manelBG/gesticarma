// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

// 1. Création du contexte
const AuthContext = createContext();

// 2. Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3. Simuler un utilisateur connecté (à remplacer plus tard par un vrai backend avec JWT/token)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 4. Connexion (à utiliser dans ta page Login)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 5. Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Hook personnalisé pour accéder au contexte
export const useAuthContext = () => {
  return useContext(AuthContext);
};
