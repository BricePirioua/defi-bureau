import React, { useState, useEffect } from 'react';
import { Trophy, ArrowBigUp, Crown, Clock, AlertCircle } from 'lucide-react';

const App = () => {
  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('defi-bureau-scores');
    return savedScores ? JSON.parse(savedScores) : {
      brice: 0,
      cecile: 0
    };
  });

  const [winner, setWinner] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isWithinWorkHours, setIsWithinWorkHours] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkWorkHours = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 5 = Vendredi
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour * 60 + minutes;
    
    const startTime = 8 * 60 + 45; // 8h45
    const endTime = 16 * 60 + 40;  // 16h40
    const fridayEndTime = 16 * 60 + 30; // 16h30

    // Vérifier si on est en semaine
    if (day === 0 || day === 6) {
      setErrorMessage('Le défi est actif uniquement en semaine !');
      return false;
    }

    // Vérifier si on est vendredi
    if (day === 5) {
      if (currentTime < startTime || currentTime > fridayEndTime) {
        setErrorMessage('Le vendredi, le défi est actif de 8h45 à 16h30 !');
        return false;
      }
    } else {
      if (currentTime < startTime || currentTime > endTime) {
        setErrorMessage('Le défi est actif de 8h45 à 16h40 !');
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  // Vérifier les heures de travail toutes les minutes
  useEffect(() => {
    const checkTime = () => {
      setIsWithinWorkHours(checkWorkHours());
    };
    
    checkTime(); // Vérification initiale
    
    const interval = setInterval(checkTime, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('defi-bureau-scores', JSON.stringify(scores));
    
    if (scores.brice > scores.cecile) {
      setWinner('brice');
    } else if (scores.cecile > scores.brice) {
      setWinner('cecile');
    } else {
      setWinner(null);
    }

    setLastUpdate(new Date().toLocaleTimeString());
  }, [scores]);

  const incrementScore = (player) => {
    if (!isWithinWorkHours) {
      alert(errorMessage || 'Vous ne pouvez pas incrémenter le score en dehors des heures de travail !');
      return;
    }

    setScores(prev => ({
      ...prev,
      [player]: prev[player] + 1
    }));
  };

  const resetScores = () => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir réinitialiser les scores ?");
    if (confirmation) {
      setScores({
        brice: 0,
        cecile: 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-purple-800">
          Défi Bureau 🏢
        </h1>
        
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isWithinWorkHours ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <Clock size={20} />
            {isWithinWorkHours ? 'Défi actif' : 'Défi en pause'}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle size={20} />
            {errorMessage}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8">
          {/* Brice */}
          <div className="bg-white rounded-lg p-6 shadow-lg text-center relative">
            {winner === 'brice' && (
              <Crown className="absolute top-2 right-2 text-yellow-500" size={24} />
            )}
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Brice</h2>
            <div className="text-6xl font-bold mb-4 text-blue-800">
              {scores.brice}
            </div>
            <p className="text-gray-600 mb-4">levés du bureau</p>
            <button
              onClick={() => incrementScore('brice')}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 w-full transition-transform hover:scale-105 ${!isWithinWorkHours && 'opacity-50 cursor-not-allowed'}`}
              disabled={!isWithinWorkHours}
            >
              <ArrowBigUp />
              Je me lève !
            </button>
          </div>

          {/* Cécile */}
          <div className="bg-white rounded-lg p-6 shadow-lg text-center relative">
            {winner === 'cecile' && (
              <Crown className="absolute top-2 right-2 text-yellow-500" size={24} />
            )}
            <h2 className="text-2xl font-bold mb-4 text-pink-600">Cécile</h2>
            <div className="text-6xl font-bold mb-4 text-pink-800">
              {scores.cecile}
            </div>
            <p className="text-gray-600 mb-4">levés du bureau</p>
            <button
              onClick={() => incrementScore('cecile')}
              className={`bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 w-full transition-transform hover:scale-105 ${!isWithinWorkHours && 'opacity-50 cursor-not-allowed'}`}
              disabled={!isWithinWorkHours}
            >
              <ArrowBigUp />
              Je me lève !
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Statistiques
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-600">Total des levés</p>
              <p className="text-2xl font-bold">{scores.brice + scores.cecile}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Différence</p>
              <p className="text-2xl font-bold">
                {Math.abs(scores.brice - scores.cecile)}
              </p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Dernière mise à jour : {lastUpdate}
          </div>
          <button
            onClick={resetScores}
            className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Réinitialiser les scores
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;