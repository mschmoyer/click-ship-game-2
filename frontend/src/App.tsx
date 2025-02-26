import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// Import components
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import ProgressBar from './components/ui/ProgressBar';
import Leaderboard from './components/Leaderboard';

// Import store
import { useGameStore, Business } from './store/gameStore';

// Game views
type GameView = 'home' | 'orders' | 'tech' | 'leaderboard';

function App() {
  // Game store
  const gameState = useGameStore((state) => state.gameState);
  const businesses = useGameStore((state) => state.businesses);
  const currentBusinessId = useGameStore((state) => state.currentBusinessId);
  const productionProgress = useGameStore((state) => state.productionProgress);
  const shippingProgress = useGameStore((state) => state.shippingProgress);
  const inventory = useGameStore((state) => state.inventory);
  const isProducing = useGameStore((state) => state.isProducing);
  const isShipping = useGameStore((state) => state.isShipping);
  const orders = useGameStore((state) => state.orders);
  const statistics = useGameStore((state) => state.statistics);
  const technologies = useGameStore((state) => state.technologies);
  const createBusiness = useGameStore((state) => state.createBusiness);
  const resetGame = useGameStore((state) => state.resetGame);
  const incrementProduction = useGameStore((state) => state.incrementProduction);
  const incrementShipping = useGameStore((state) => state.incrementShipping);
  const generateOrder = useGameStore((state) => state.generateOrder);
  const checkExpiredOrders = useGameStore((state) => state.checkExpiredOrders);
  const purchaseTechnology = useGameStore((state) => state.purchaseTechnology);
  const upgradeTechnology = useGameStore((state) => state.upgradeTechnology);
  
  // Local state
  const [businessName, setBusinessName] = useState('');
  const [productType, setProductType] = useState('');
  const [currentView, setCurrentView] = useState<GameView>('home');
  
  // Get current business
  const currentBusiness = businesses.find(b => b.id === currentBusinessId) || null;
  
  // Generate orders periodically
  useEffect(() => {
    if (gameState === 'playing' && currentBusinessId) {
      // Generate an initial order
      generateOrder();
      
      // Get order frequency technology
      const orderFrequencyTech = technologies.find(
        (t) => t.id === 'tech-3' && t.purchased
      );
      
      // Calculate order generation interval (reduced by technology)
      let orderInterval = 30000; // Base: 30 seconds
      if (orderFrequencyTech) {
        // Reduce interval by 25% per level
        const reductionFactor = 1 - (orderFrequencyTech.level * 0.25);
        orderInterval = Math.max(5000, orderInterval * reductionFactor); // Minimum 5 seconds
      }
      
      // Set up interval to generate orders
      const intervalId = setInterval(() => {
        generateOrder();
      }, orderInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [gameState, currentBusinessId, generateOrder, technologies]);
  
  // Check for expired orders
  useEffect(() => {
    if (gameState === 'playing') {
      // Check immediately
      checkExpiredOrders();
      
      // Set up interval to check for expired orders
      const expiryCheckInterval = setInterval(() => {
        checkExpiredOrders();
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(expiryCheckInterval);
    }
  }, [gameState, checkExpiredOrders]);
  
  // Auto-increment production progress when producing
  useEffect(() => {
    console.log("Production useEffect triggered. isProducing:", isProducing, "gameState:", gameState);
    
    if (gameState === 'playing' && isProducing) {
      console.log("Starting production auto-increment interval");
      
      // Get production speed modifier from technologies
      const productionSpeedTech = technologies.find(
        (t) => t.id === 'tech-1' && t.purchased
      );
      
      // Calculate increment amount (base + tech bonus)
      let incrementAmount = 4; // Base amount per tick (doubled for faster completion)
      if (productionSpeedTech) {
        // Add 33% per level
        incrementAmount += incrementAmount * (productionSpeedTech.level * 0.33);
      }
      
      console.log("Production increment amount:", incrementAmount);
      
      // Set up interval to increment production progress
      const productionInterval = setInterval(() => {
        console.log("Production interval tick");
        incrementProduction();
      }, 1000); // Update every second
      
      return () => {
        console.log("Clearing production interval");
        clearInterval(productionInterval);
      };
    }
  }, [gameState, isProducing, incrementProduction, technologies]);
  
  // Auto-increment shipping progress when shipping
  useEffect(() => {
    console.log("Shipping useEffect triggered. isShipping:", isShipping, "gameState:", gameState);
    
    if (gameState === 'playing' && isShipping) {
      console.log("Starting shipping auto-increment interval");
      
      // Get shipping speed modifier from technologies
      const shippingSpeedTech = technologies.find(
        (t) => t.id === 'tech-2' && t.purchased
      );
      
      // Calculate increment amount (base + tech bonus)
      let incrementAmount = 4; // Base amount per tick (doubled for faster completion)
      if (shippingSpeedTech) {
        // Add 33% per level
        incrementAmount += incrementAmount * (shippingSpeedTech.level * 0.33);
      }
      
      console.log("Shipping increment amount:", incrementAmount);
      
      // Set up interval to increment shipping progress
      const shippingInterval = setInterval(() => {
        console.log("Shipping interval tick");
        incrementShipping();
      }, 1000); // Update every second
      
      return () => {
        console.log("Clearing shipping interval");
        clearInterval(shippingInterval);
      };
    }
  }, [gameState, isShipping, incrementShipping, technologies]);
  
  // Handle business creation
  const handleCreateBusiness = () => {
    if (businessName.trim() === '' || productType.trim() === '') {
      alert('Please enter both business name and product type');
      return;
    }
    
    createBusiness(businessName, productType);
  };
  
  // Handle starting a new game
  const handleNewGame = () => {
    setBusinessName('');
    setProductType('');
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {gameState === 'setup' ? (
        // Initial Setup Screen
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="p-6">
              <h1 className="text-3xl font-bold text-center mb-6 text-primary">Click & Ship Tycoon</h1>
              <div className="mb-4">
                <label htmlFor="businessName" className="block text-sm font-medium mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  placeholder="Enter your business name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="productType" className="block text-sm font-medium mb-1">
                  Product Type
                </label>
                <input
                  type="text"
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  placeholder="What products do you sell?"
                />
              </div>
              <Button
                variant="primary"
                isFullWidth
                onClick={handleCreateBusiness}
              >
                Start Business
              </Button>
            </Card>
          </motion.div>
        </div>
      ) : (
        // Main Game Screen
        <div className="flex flex-col h-screen">
          {/* Header - Info View */}
          <header className="bg-header-footer text-white shadow-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-bold">{currentBusiness?.name}</h1>
                <p className="text-sm text-gray-200">{currentBusiness?.productType}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-200">Money</p>
                  <p className="font-bold text-green-300">${currentBusiness?.money}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">Reputation</p>
                  <p className="font-bold text-blue-300">{currentBusiness?.reputation}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">Inventory</p>
                  <p className="font-bold text-amber-300">{inventory}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-200">Orders Shipped</p>
                  <p className="font-bold text-purple-300">{statistics.ordersShipped}</p>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4">
            {currentView === 'home' && (
              <>
                {/* Game Space - Product Building and Shipping */}
                <Card title="Workshop" className="mb-4">
                  <div className="flex flex-col gap-4">
                    {/* Product Building */}
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Build Products</h3>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Cost: </span>
                          <span className="font-medium text-red-600">$10</span>
                        </div>
                      </div>
                      {/* Calculate animation duration based on production speed */}
                      {(() => {
                        // Get production speed modifier from technologies
                        const productionSpeedTech = technologies.find(
                          (t) => t.id === 'tech-1' && t.purchased
                        );
                        // Fixed duration of 3 seconds regardless of technology level
                        const duration = 3;
                        
                        return (
                          <ProgressBar
                            progress={productionProgress}
                            className="mb-2"
                            animated={isProducing}
                            duration={duration}
                          />
                        );
                      })()}
                      {/* Debug info */}
                      <div className="text-xs text-gray-500 mb-1">
                        Progress: {productionProgress.toFixed(1)}%, Animating: {isProducing ? 'Yes' : 'No'}
                      </div>
                      {/* Technology effects display */}
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2">
                        {/* Show bulk production bonus if technology is purchased */}
                        {technologies.find(t => t.id === 'tech-6' && t.purchased) && (
                          <div className="flex items-center">
                            <span className="mr-1">{technologies.find(t => t.id === 'tech-6')?.icon}</span>
                            <span>
                              Bulk Production: +{Math.floor((technologies.find(t => t.id === 'tech-6')?.level || 0) * (technologies.find(t => t.id === 'tech-6')?.effect || 0))} products per build
                            </span>
                          </div>
                        )}
                        
                        {/* Show production speed bonus if technology is purchased */}
                        {technologies.find(t => t.id === 'tech-1' && t.purchased) && (
                          <div className="flex items-center">
                            <span className="mr-1">{technologies.find(t => t.id === 'tech-1')?.icon}</span>
                            <span>
                              Production Speed: +{Math.floor((technologies.find(t => t.id === 'tech-1')?.level || 0) * (technologies.find(t => t.id === 'tech-1')?.effect || 0) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {isProducing ? 'Building...' : 'Ready to build'}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Inventory: </span>
                          <span className="font-medium text-amber-600">{inventory}</span>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        isFullWidth
                        onClick={incrementProduction}
                        disabled={isProducing || (currentBusiness ? currentBusiness.money < 10 : false)}
                      >
                        {isProducing ? 'Continue Building' : 'Build Product'}
                      </Button>
                    </div>
                    
                    {/* Order Shipping */}
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Ship Orders</h3>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Cost: </span>
                          <span className="font-medium text-red-600">
                            {isShipping ? `$${useGameStore.getState().shippingCost}` : 'Varies'}
                          </span>
                        </div>
                      </div>
                      {/* Calculate animation duration based on shipping speed */}
                      {(() => {
                        // Get shipping speed modifier from technologies
                        const shippingSpeedTech = technologies.find(
                          (t) => t.id === 'tech-2' && t.purchased
                        );
                        
                        // Fixed duration of 3 seconds regardless of technology level
                        const duration = 3;
                        
                        return (
                          <ProgressBar
                            progress={shippingProgress}
                            color="bg-accent"
                            className="mb-2"
                            animated={isShipping}
                            duration={duration}
                          />
                        );
                      })()}
                      {/* Debug info */}
                      <div className="text-xs text-gray-500 mb-1">
                        Progress: {shippingProgress.toFixed(1)}%, Animating: {isShipping ? 'Yes' : 'No'},
                        Order ID: {useGameStore.getState().currentShippingOrderId || 'None'}
                      </div>
                      
                      {/* Technology effects display */}
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2">
                        {/* Show shipping discount if technology is purchased */}
                        {technologies.find(t => t.id === 'tech-4' && t.purchased) && (
                          <div className="flex items-center">
                            <span className="mr-1">{technologies.find(t => t.id === 'tech-4')?.icon}</span>
                            <span>
                              Shipping Discount: {Math.floor((technologies.find(t => t.id === 'tech-4')?.level || 0) * (technologies.find(t => t.id === 'tech-4')?.effect || 0) * 100)}%
                            </span>
                          </div>
                        )}
                        
                        {/* Show shipping speed bonus if technology is purchased */}
                        {technologies.find(t => t.id === 'tech-2' && t.purchased) && (
                          <div className="flex items-center">
                            <span className="mr-1">{technologies.find(t => t.id === 'tech-2')?.icon}</span>
                            <span>
                              Shipping Speed: +{Math.floor((technologies.find(t => t.id === 'tech-2')?.level || 0) * (technologies.find(t => t.id === 'tech-2')?.effect || 0) * 100)}%
                            </span>
                          </div>
                        )}
                        
                        {/* Show revenue boost if technology is purchased */}
                        {technologies.find(t => t.id === 'tech-5' && t.purchased) && (
                          <div className="flex items-center">
                            <span className="mr-1">{technologies.find(t => t.id === 'tech-5')?.icon}</span>
                            <span>
                              Revenue Boost: +{Math.floor((technologies.find(t => t.id === 'tech-5')?.level || 0) * (technologies.find(t => t.id === 'tech-5')?.effect || 0) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {isShipping ? 'Shipping...' : (
                            inventory > 0 ?
                              (orders.some(o => o.status === 'pending') ? 'Ready to ship' : 'No pending orders') :
                              'No inventory'
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Pending Orders: </span>
                          <span className="font-medium text-yellow-600">
                            {orders.filter(o => o.status === 'pending').length}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="accent"
                        isFullWidth
                        onClick={incrementShipping}
                        disabled={isShipping || inventory === 0 || !orders.some(o => o.status === 'pending')}
                      >
                        {isShipping ? 'Continue Shipping' : 'Ship Order'}
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {/* Orders View */}
                <Card title="Orders" className="mb-4">
                  {orders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No orders yet. They will appear here soon!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.map(order => (
                        <div
                          key={order.id}
                          className={`p-3 rounded-md border ${
                            order.status === 'pending' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' :
                            order.status === 'in_progress' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 shadow-md' :
                            order.status === 'completed' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' :
                            order.status === 'shipped' ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
                            'border-red-300 bg-red-50 dark:bg-red-900/20'
                          } ${order.id === useGameStore.getState().currentShippingOrderId ? 'ring-2 ring-accent' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{order.productType}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Value: ${order.value} • Complexity: {order.complexity}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {order.status !== 'shipped' && order.status !== 'expired' ? (
                                  <>
                                    Deadline: {new Date(order.deadline).toLocaleTimeString()} (
                                    {Math.max(0, Math.floor((new Date(order.deadline).getTime() - Date.now()) / 60000))} min left)
                                  </>
                                ) : (
                                  order.status === 'shipped' ? 'Shipped successfully!' : 'Order expired'
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                order.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                                order.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                                order.status === 'shipped' ? 'bg-green-200 text-green-800' :
                                'bg-red-200 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                              </span>
                              {order.status === 'pending' && (
                                <p className="text-xs mt-1">
                                  <span className="text-gray-500">Profit: </span>
                                  <span className="font-medium text-green-600">
                                    ${Math.floor(order.value * 0.8)}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}
            
            {currentView === 'orders' && (
              <Card title="All Orders" className="mb-4">
                {orders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No orders yet. They will appear here soon!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className={`p-3 rounded-md border ${
                          order.status === 'pending' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' :
                          order.status === 'in_progress' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 shadow-md' :
                          order.status === 'completed' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' :
                          order.status === 'shipped' ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
                          'border-red-300 bg-red-50 dark:bg-red-900/20'
                        } ${order.id === useGameStore.getState().currentShippingOrderId ? 'ring-2 ring-accent' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{order.productType}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Value: ${order.value} • Complexity: {order.complexity}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {order.status !== 'shipped' && order.status !== 'expired' ? (
                                <>
                                  Deadline: {new Date(order.deadline).toLocaleTimeString()} (
                                  {Math.max(0, Math.floor((new Date(order.deadline).getTime() - Date.now()) / 60000))} min left)
                                </>
                              ) : (
                                order.status === 'shipped' ? 'Shipped successfully!' : 'Order expired'
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                              order.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                              order.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                              order.status === 'shipped' ? 'bg-green-200 text-green-800' :
                              'bg-red-200 text-red-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                            </span>
                            {order.status === 'pending' && (
                              <p className="text-xs mt-1">
                                <span className="text-gray-500">Profit: </span>
                                <span className="font-medium text-green-600">
                                  ${Math.floor(order.value * 0.8)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            
            {currentView === 'tech' && (
              <Card title="Technologies" className="mb-4">
                {technologies.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No technologies available yet!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {technologies.map(tech => (
                      <div
                        key={tech.id}
                        className={`p-4 rounded-md border ${
                          tech.purchased
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-xl mr-2">{tech.icon}</span>
                              <h3 className="font-medium">{tech.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tech.description}
                            </p>
                            {tech.purchased && tech.levelNames && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Level {tech.level}: <span className="font-medium">{tech.levelNames[tech.level]}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {tech.level > 0 && (
                                    tech.type === 'production'
                                      ? `+${tech.level * tech.effect} products per build`
                                      : tech.type === 'cost'
                                        ? `${Math.round(tech.effect * tech.level * 100)}% discount`
                                        : `${Math.round(tech.effect * tech.level * 100)}% bonus`
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              tech.type === 'efficiency' ? 'bg-blue-200 text-blue-800' :
                              tech.type === 'automation' ? 'bg-purple-200 text-purple-800' :
                              tech.type === 'cost' ? 'bg-green-200 text-green-800' :
                              tech.type === 'revenue' ? 'bg-yellow-200 text-yellow-800' :
                              tech.type === 'production' ? 'bg-red-200 text-red-800' :
                              'bg-amber-200 text-amber-800'
                            }`}>
                              {tech.type.charAt(0).toUpperCase() + tech.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {tech.purchased ? (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Upgrade to: <span className="font-medium">{tech.levelNames && tech.levelNames[tech.level + 1]}</span>
                              </span>
                              <span className={`text-sm font-medium ${
                                currentBusiness && currentBusiness.money >= (tech.cost * (tech.level + 1))
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                Cost: ${tech.cost * (tech.level + 1)}
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              isFullWidth
                              onClick={() => upgradeTechnology(tech.id)}
                              disabled={!currentBusiness || currentBusiness.money < (tech.cost * (tech.level + 1))}
                            >
                              Upgrade
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Purchase to unlock
                              </span>
                              <span className={`text-sm font-medium ${
                                currentBusiness && currentBusiness.money >= tech.cost
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                Cost: ${tech.cost}
                              </span>
                            </div>
                            <Button
                              variant="primary"
                              isFullWidth
                              onClick={() => purchaseTechnology(tech.id)}
                              disabled={!currentBusiness || currentBusiness.money < tech.cost}
                            >
                              Purchase
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            
            {currentView === 'leaderboard' && (
              <Card title="Leaderboard" className="mb-4">
                <Leaderboard />
              </Card>
            )}
          </main>
          
          {/* Footer - Navigation */}
          <footer className="bg-header-footer text-white shadow-md p-2">
            <div className="flex justify-around">
              <button
                className={`p-2 text-center ${currentView === 'home' ? 'text-white font-bold' : 'text-gray-200'}`}
                onClick={() => setCurrentView('home')}
              >
                <span className="block text-2xl">🏠</span>
                <span className="text-xs">Home</span>
              </button>
              <button
                className={`p-2 text-center ${currentView === 'orders' ? 'text-white font-bold' : 'text-gray-200'}`}
                onClick={() => setCurrentView('orders')}
              >
                <span className="block text-2xl">🛒</span>
                <span className="text-xs">Orders</span>
              </button>
              <button
                className={`p-2 text-center ${currentView === 'tech' ? 'text-white font-bold' : 'text-gray-200'}`}
                onClick={() => setCurrentView('tech')}
              >
                <span className="block text-2xl">⚙️</span>
                <span className="text-xs">Tech</span>
              </button>
              <button
                className={`p-2 text-center ${currentView === 'leaderboard' ? 'text-white font-bold' : 'text-gray-200'}`}
                onClick={() => setCurrentView('leaderboard')}
              >
                <span className="block text-2xl">🏆</span>
                <span className="text-xs">Leaderboard</span>
              </button>
              <button
                className="p-2 text-center text-gray-200"
                onClick={handleNewGame}
              >
                <span className="block text-2xl">🔄</span>
                <span className="text-xs">New Game</span>
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
