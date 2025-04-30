import React from "react";


const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-15 px-1 flex flex-col items-center">
      
      {/* Grand carré englobant tout */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-7xl">

        {/* Titre principal à l'intérieur du carré */}
        <h1 className="text-5xl md:text-6xl text-center text-gray-800 font-pacifico mb-12">
          Les Notifications
        </h1>

        {/* Bloc horizontal contenant les deux catégories */}
        <div className="flex flex-col md:flex-row justify-center gap-8">
          
          {/* Notifications Prioritaires */}
          <div className="flex-1 bg-red-100 border-l-8 border-red-500 rounded-2xl shadow-lg p-8 min-h-[300px]">
            <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
              ⚠️ Notifications Prioritaires
            </h2>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-semibold text-red-600">Mission critique à valider</h3>
              <p className="text-sm text-gray-700 mt-1">Une nouvelle mission attend votre approbation.</p>
              <span className="text-xs text-gray-500 block mt-2">30 avril 2025 à 14:32</span>
            </div>
          </div>

          {/* Notifications Générales */}
          <div className="flex-1 bg-blue-100 border-l-8 border-blue-500 rounded-2xl shadow-lg p-8 min-h-[300px]">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              ℹ️ Notifications Générales
            </h2>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-semibold text-blue-700">Mission validée</h3>
              <p className="text-sm text-gray-700 mt-1">Votre mission a été validée avec succès.</p>
              <span className="text-xs text-gray-500 block mt-2">29 avril 2025 à 17:00</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
