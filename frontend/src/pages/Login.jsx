import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../index.css';


const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }
  
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
  
      const loggedInUser = response.data.user;
      const token = response.data.token;
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", token);
      login(loggedInUser); // appelle ton contexte si tu veux gérer le user globalement
      console.log('Connexion réussie ✅', loggedInUser);
  
      const role = loggedInUser.role;
      if ( role === "admin") {
        navigate("/AdminAccueil"); // Pour le directeur
      } else if ( role === "employee") {
        navigate("/employeeaccueil"); // Pour l'employé
      } else if ( role === "technicien") {
        navigate("/techaccueil"); // Pour le technicien
      } else {
        navigate("/non-autorise"); // Par défaut si le rôle est incorrect
      }
      
    } catch (error) {
      let message = 'Erreur de connexion';
      if (error.response) {
        message =
          error.response.data.error ||
          error.response.data.message ||
          `Erreur ${error.response.status}`;
      } else if (error.request) {
        message = 'Le serveur ne répond pas';
      }
      setErrorMessage(message);
      console.error('Erreur détaillée:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('../images/font3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 text-yellow-400 opacity-10 rounded-full blur-2xl z-0"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="z-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-10 w-full max-w-md space-y-6 text-white"
      >
        <h1 className="text-3xl font-pacifico text-center">
          Bienvenue dans votre espace
        </h1>
        <p className="text-center text-white/80">
          Optimisez votre parc, connectez-vous !
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
              <Mail className="mr-2 text-white" size={18} />
              <input
                type="email"
                id="email"
                placeholder="exemple@gmail.com"
                className="bg-transparent outline-none w-full placeholder-white/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Mot de passe
            </label>
            <div className="flex items-center bg-white/20 rounded-lg px-3 py-2">
              <Lock className="mr-2 text-white" size={18} />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-transparent outline-none w-full placeholder-white/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 bg-yellow-400 text-teal-900 font-bold rounded-lg shadow hover:bg-yellow-400 transition"
            disabled={isLoading}
          >
            {isLoading ?  'connexion' : 'Connexion'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
