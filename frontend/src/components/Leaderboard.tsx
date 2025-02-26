import React, { useEffect } from 'react';
import { useGameStore, LeaderboardEntry } from '../store/gameStore';

const Leaderboard: React.FC = () => {
  // Get current business and leaderboard data
  const currentBusinessId = useGameStore((state) => state.currentBusinessId);
  const updateLeaderboard = useGameStore((state) => state.updateLeaderboard);
  
  // Use selectors to get the leaderboard data instead of calling functions directly
  const leaderboard = useGameStore((state) => state.leaderboard);
  
  // Compute the sorted leaderboards locally
  const moneyLeaderboard = [...leaderboard].sort((a, b) => b.money - a.money);
  const shippingLeaderboard = [...leaderboard].sort((a, b) => b.ordersShipped - a.ordersShipped);
  
  // Update leaderboard when component mounts
  useEffect(() => {
    // Call updateLeaderboard only once when the component mounts
    updateLeaderboard();
    // Don't include updateLeaderboard in the dependency array to avoid infinite loops
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Money Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="text-xl mr-2">💰</span>
          Most Money Earned
        </h3>
        {moneyLeaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet</p>
        ) : (
          <ul className="space-y-2">
            {moneyLeaderboard.map((entry, index) => (
              <li 
                key={entry.businessId}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  index === 1 ? 'bg-gray-100 dark:bg-gray-700/50' :
                  index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' : ''
                } ${entry.businessId === currentBusinessId ? 'border-2 border-primary' : ''}`}
              >
                <div className="flex items-center">
                  <span className="font-bold w-8">{index + 1}.</span>
                  <span>{entry.businessName}</span>
                  {entry.businessId === currentBusinessId && (
                    <span className="ml-2 text-xs bg-primary text-white px-1 rounded">You</span>
                  )}
                </div>
                <span className="font-medium text-green-600">${Math.floor(entry.totalMoneyEarned)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Shipping Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="text-xl mr-2">📦</span>
          Most Orders Shipped
        </h3>
        {shippingLeaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet</p>
        ) : (
          <ul className="space-y-2">
            {shippingLeaderboard.map((entry, index) => (
              <li 
                key={entry.businessId}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  index === 1 ? 'bg-gray-100 dark:bg-gray-700/50' :
                  index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' : ''
                } ${entry.businessId === currentBusinessId ? 'border-2 border-primary' : ''}`}
              >
                <div className="flex items-center">
                  <span className="font-bold w-8">{index + 1}.</span>
                  <span>{entry.businessName}</span>
                  {entry.businessId === currentBusinessId && (
                    <span className="ml-2 text-xs bg-primary text-white px-1 rounded">You</span>
                  )}
                </div>
                <span className="font-medium text-purple-600">{Math.floor(entry.ordersShipped)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;