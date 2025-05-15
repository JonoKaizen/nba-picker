import React, { useEffect, useState } from "react";
import axios from "axios";

const NBA_API_URL = "https://www.balldontlie.io/api/v1/players";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(NBA_API_URL, {
        params: {
          per_page: 2,
          page: Math.floor(Math.random() * 50),
        },
      });
      const fetchedPlayers = response.data.data || [];
      setPlayers(fetchedPlayers);
      const initialVotes = {};
      fetchedPlayers.forEach((player) => {
        initialVotes[player.id] = votes[player.id] || 0;
      });
      setVotes(initialVotes);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
    setLoading(false);
  };

  const getPlayerImage = (id) => {
    return `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`;
  };

  const handleVote = (playerId) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [playerId]: (prevVotes[playerId] || 0) + 1,
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Pick Your Favorite NBA Player</h1>
        <button onClick={fetchPlayers} className="border rounded px-4 py-2 bg-blue-500 text-white">
          New Matchup
        </button>
      </div>

      {loading ? (
        <p>Loading players...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => (
            <div key={player.id} className="text-center border rounded p-4">
              <img
                src={getPlayerImage(player.id)}
                alt={`${player.first_name} ${player.last_name}`}
                className="w-full h-40 object-contain mb-2"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <p className="font-semibold">
                {player.first_name} {player.last_name}
              </p>
              <p className="text-sm text-gray-500">{player.team.full_name}</p>
              <p className="text-sm text-gray-600">Votes: {votes[player.id] || 0}</p>
              <button
                className="mt-2 w-full border rounded bg-green-500 text-white py-1"
                onClick={() => handleVote(player.id)}
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
