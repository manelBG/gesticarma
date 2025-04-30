import React from 'react';
import { useAuth } from '../hooks/useAuth'; // suppose que tu as ce hook
import { Card, CardContent } from '@/components/ui/card';


const Profil = () => {
  const { user } = useAuth(); // récupère l'utilisateur connecté

  if (!user) return <div>Chargement...</div>;

  // Déterminer la photo de profil en fonction du genre
  const getProfilePhoto = () => {
    if (user.photo) return user.photo;
    if (user.genre === 'male') return '/images/user-male.jpg';
    if (user.genre === 'female') return '/images/user-femmale.jpg';
    return '/images/neutre.jpg'; // image neutre
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl text-center mb-8 font-pacifico text-blue-900">
          Profil de {user.prenom}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={getProfilePhoto()}
            alt="Photo de profil"
            className="w-40 h-40 rounded-full border-4 border-blue-800 object-cover"
          />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Nom</p>
                <p className="font-semibold">{user.nom}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Prénom</p>
                <p className="font-semibold">{user.prenom}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Téléphone</p>
                <p className="font-semibold">{user.telephone || 'Non renseigné'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Rôle</p>
                <p className="font-semibold capitalize">{user.role}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-500">Genre</p>
                <p className="font-semibold capitalize">{user.genre || 'Non spécifié'}</p>
              </CardContent>
            </Card>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default Profil;
