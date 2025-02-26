import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Game state types
export type GameState = 'setup' | 'playing';

// Business interface
export interface Business {
  id: string;
  name: string;
  productType: string;
  money: number;
  reputation: number;
  createdAt: Date;
  lastPlayedAt: Date;
}

// Order status
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'shipped' | 'expired';

// Order interface
export interface Order {
  id: string;
  productType: string;
  status: OrderStatus;
  value: number;
  complexity: number;
  createdAt: Date;
  deadline: Date;
  statusChangedAt?: Date; // Add timestamp for status changes
}

// Technology type
export type TechnologyType = 'automation' | 'efficiency' | 'capacity' | 'cost' | 'revenue' | 'production';

// Technology interface
export interface Technology {
  id: string;
  name: string;
  description: string;
  type: TechnologyType;
  level: number;
  cost: number;
  effect: number;
  purchased: boolean;
  levelNames?: string[]; // Array of names for each level
  icon?: string; // Emoji icon for the technology
}

// Statistics interface
export interface Statistics {
  ordersReceived: number;
  productsCreated: number;
  ordersShipped: number;
  ordersExpired: number;
  totalRevenue: number;
  totalSpent: number;
  totalMoneyEarned: number; // New field for cumulative revenue
}

// Leaderboard entry interface
export interface LeaderboardEntry {
  businessId: string;
  businessName: string;
  money: number;
  totalMoneyEarned: number; // Add this field for cumulative revenue
  ordersShipped: number;
  lastUpdated: Date;
}

// Game store state
interface GameStoreState {
  // Game state
  gameState: 'setup' | 'playing';
  
  // Current business
  currentBusinessId: string | null;
  businesses: Business[];
  
  // Game data
  orders: Order[];
  technologies: Technology[];
  statistics: Statistics;
  
  // Production state
  productionProgress: number;
  shippingProgress: number;
  inventory: number;
  isProducing: boolean;
  isShipping: boolean;
  currentShippingOrderId: string | null;
  productionCost: number;
  shippingCost: number;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  
  // Actions
  setGameState: (state: 'setup' | 'playing') => void;
  createBusiness: (name: string, productType: string) => void;
  selectBusiness: (id: string) => void;
  resetGame: () => void;
  
  // Game mechanics
  incrementProduction: () => void;
  incrementShipping: () => void;
  generateOrder: () => void;
  completeOrder: (orderId: string) => void;
  purchaseTechnology: (technologyId: string) => void;
  upgradeTechnology: (technologyId: string) => void;
  checkExpiredOrders: () => void;
  
  // Leaderboard functions
  updateLeaderboard: () => void;
  getMoneyLeaderboard: () => LeaderboardEntry[];
  getShippingLeaderboard: () => LeaderboardEntry[];
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Initial technologies
const initialTechnologies: Technology[] = [
  {
    id: 'tech-1',
    name: 'Faster Production',
    description: 'Increases production speed by 33% per level',
    type: 'efficiency',
    level: 0,
    cost: 100,
    effect: 0.33, // 33% increase per level
    purchased: false,
    icon: '⚡',
    levelNames: [
      'Manual Assembly',
      'Basic Automation',
      'Batch Processing',
      'Advanced Assembly Line',
      'Smart Manufacturing'
    ],
  },
  {
    id: 'tech-7',
    name: 'Auto-Build',
    description: 'Automatically starts building a new product when the previous one is completed',
    type: 'automation',
    level: 0,
    cost: 1000,
    effect: 1, // Boolean effect (1 = enabled)
    purchased: false,
    icon: '🤖',
    levelNames: [
      'Manual Building',
      'Automated Building'
    ],
  },
  {
    id: 'tech-8',
    name: 'Auto-Ship',
    description: 'Automatically starts shipping a new order when the previous one is completed',
    type: 'automation',
    level: 0,
    cost: 1000,
    effect: 1, // Boolean effect (1 = enabled)
    purchased: false,
    icon: '📦',
    levelNames: [
      'Manual Shipping',
      'Automated Shipping'
    ],
  },
  {
    id: 'tech-2',
    name: 'Faster Shipping',
    description: 'Increases shipping speed by 33% per level',
    type: 'efficiency',
    level: 0,
    cost: 100,
    effect: 0.33, // 33% increase per level
    purchased: false,
    icon: '🚚',
    levelNames: [
      'Manual Shipping',
      'Shipping Presets',
      'Batch Shipping',
      'Automated Rate Selection',
      'Priority Processing'
    ],
  },
  {
    id: 'tech-3',
    name: 'Order Frequency',
    description: 'Orders come in 25% faster per level',
    type: 'efficiency',
    level: 0,
    cost: 150,
    effect: 0.25, // 25% increase per level
    purchased: false,
    icon: '📊',
    levelNames: [
      'Basic Marketplace',
      'Branded Storefront',
      'Multi-Channel Integration',
      'Marketplace Optimizer',
      'Global Marketplace Hub'
    ],
  },
  // New technologies
  {
    id: 'tech-4',
    name: 'Shipping Discount',
    description: 'Reduces shipping costs by 15% per level',
    type: 'cost',
    level: 0,
    cost: 120,
    effect: 0.15, // 15% decrease per level
    purchased: false,
    icon: '💸',
    levelNames: [
      'Basic Rates',
      'Discount Codes',
      'Carrier Negotiation',
      'Rate Shopping',
      'Enterprise Rates'
    ],
  },
  {
    id: 'tech-5',
    name: 'Revenue Boost',
    description: 'Increases order value by 20% per level',
    type: 'revenue',
    level: 0,
    cost: 200,
    effect: 0.20, // 20% increase per level
    purchased: false,
    icon: '💰',
    levelNames: [
      'Basic Pricing',
      'Value-Based Pricing',
      'Premium Packaging',
      'Upsell Automation',
      'Dynamic Pricing'
    ],
  },
  {
    id: 'tech-6',
    name: 'Bulk Production',
    description: 'Produces 1 additional product per build per level',
    type: 'production',
    level: 0,
    cost: 250,
    effect: 1, // 1 additional product per level
    purchased: false,
    icon: '📦',
    levelNames: [
      'Single Production',
      'Dual Production',
      'Small Batch',
      'Large Batch',
      'Mass Production'
    ],
  },
];

// Initial statistics
const initialStatistics: Statistics = {
  ordersReceived: 0,
  productsCreated: 0,
  ordersShipped: 0,
  ordersExpired: 0,
  totalRevenue: 0,
  totalSpent: 0,
  totalMoneyEarned: 0, // Initialize to 0
};

// Create the store
export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'setup',
      currentBusinessId: null,
      businesses: [],
      orders: [],
      technologies: initialTechnologies,
      statistics: initialStatistics,
      productionProgress: 0,
      shippingProgress: 0,
      inventory: 0,
      isProducing: false,
      isShipping: false,
      currentShippingOrderId: null,
      productionCost: 0,
      shippingCost: 0,
      leaderboard: [],
      
      // Actions
      setGameState: (state: 'setup' | 'playing') => set({ gameState: state }),
      
      createBusiness: (name: string, productType: string) => {
        const newBusiness: Business = {
          id: generateId(),
          name,
          productType,
          money: 250, // Starting money (increased to allow for initial costs)
          reputation: 50, // Starting reputation
          createdAt: new Date(),
          lastPlayedAt: new Date(),
        };
        
        set((state) => ({
          businesses: [...state.businesses, newBusiness],
          currentBusinessId: newBusiness.id,
          gameState: 'playing',
        }));
      },
      
      selectBusiness: (id: string) => {
        set((state: GameStoreState) => {
          const business = state.businesses.find((b: Business) => b.id === id);
          if (!business) return state;
          
          return {
            currentBusinessId: id,
            gameState: 'playing',
          };
        });
      },
      
      resetGame: () => {
        set({
          gameState: 'setup',
          currentBusinessId: null,
          orders: [],
          technologies: initialTechnologies,
          statistics: initialStatistics,
          productionProgress: 0,
          shippingProgress: 0,
          inventory: 0,
          isProducing: false,
          isShipping: false,
          currentShippingOrderId: null,
          productionCost: 0,
          shippingCost: 0,
        });
      },
      
      // Game mechanics
      
      incrementProduction: () => {
        console.log("incrementProduction called");
        
        // Get current state
        const state = get();
        console.log("Current state:", {
          isProducing: state.isProducing,
          productionProgress: state.productionProgress,
          inventory: state.inventory
        });
        
        // If not producing, start production first
        if (!state.isProducing) {
          console.log("Starting production process");
          
          // Get current business
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness) {
            console.log("No current business found");
            return;
          }
          
          // Calculate production cost (based on business type)
          const productionCost = 10; // Base cost
          
          // Check if business has enough money
          if (currentBusiness.money < productionCost) {
            console.log("Not enough money to start production");
            return;
          }
          
          // Deduct production cost
          const newBusinesses = [...state.businesses];
          const businessIndex = newBusinesses.findIndex(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          newBusinesses[businessIndex] = {
            ...currentBusiness,
            money: currentBusiness.money - productionCost,
          };
          
          // Update statistics
          const newStatistics = {
            ...state.statistics,
            totalSpent: state.statistics.totalSpent + productionCost,
          };
          
          console.log("Setting isProducing to true and resetting progress");
          set({
            isProducing: true,
            productionProgress: 0,
            productionCost,
            businesses: newBusinesses,
            statistics: newStatistics
          });
          
          return;
        }
        
        // If already producing, increment progress
        set((state: GameStoreState) => {
          console.log("Incrementing production progress");
          
          // Get production speed modifier from technologies
          const productionSpeedTech = state.technologies.find(
            (t: Technology) => t.id === 'tech-1' && t.purchased
          );
          
          // Calculate increment amount (base + tech bonus)
          let incrementAmount = 33.33; // Base amount per tick (to complete in 3 seconds)
          if (productionSpeedTech) {
            // Add 33% per level
            incrementAmount += incrementAmount * (productionSpeedTech.level * 0.33);
          }
          
          console.log("Production increment amount per tick:", incrementAmount);
          
          // Increment production progress
          let newProgress = state.productionProgress + incrementAmount;
          console.log("New progress:", newProgress);
          
          // If progress is complete, create products
          if (newProgress >= 100) {
            console.log("Production complete, adding to inventory");
            
            // Get bulk production technology
            const bulkProductionTech = state.technologies.find(
              (t: Technology) => t.id === 'tech-6' && t.purchased
            );
            
            // Calculate number of products to add (1 + bulk production bonus)
            let productsToAdd = 1;
            if (bulkProductionTech) {
              productsToAdd += bulkProductionTech.level * bulkProductionTech.effect;
              console.log(`Bulk production bonus: +${bulkProductionTech.level} products`);
            }
            
            // Update inventory
            const newInventory = state.inventory + productsToAdd;
            
            // Update statistics
            const newStatistics = {
              ...state.statistics,
              productsCreated: state.statistics.productsCreated + productsToAdd,
            };
            
            console.log(`Added ${productsToAdd} products to inventory`);
            
            // Check for Auto-Build technology
            const autoBuildTech = state.technologies.find(
              (t: Technology) => t.id === 'tech-7' && t.purchased
            );
            
            // If Auto-Build is purchased, start a new production cycle
            if (autoBuildTech) {
              // Use setTimeout to ensure the current state update completes first
              setTimeout(() => {
                const currentState = get();
                // Only auto-build if not already producing and has enough money
                if (!currentState.isProducing) {
                  const currentBusiness = currentState.businesses.find(
                    (b: Business) => b.id === currentState.currentBusinessId
                  );
                  // Check if business has enough money (production cost is 10)
                  if (currentBusiness && currentBusiness.money >= 10) {
                    get().incrementProduction();
                  }
                }
              }, 0);
            }
            
            return {
              productionProgress: 0,
              inventory: newInventory,
              isProducing: false,
              statistics: newStatistics,
            };
          }
          
          return { productionProgress: newProgress };
        });
      },
      
      incrementShipping: () => {
        console.log("incrementShipping called");
        
        // Get current state
        const state = get();
        console.log("Current state:", {
          isShipping: state.isShipping,
          shippingProgress: state.shippingProgress,
          inventory: state.inventory,
          currentShippingOrderId: state.currentShippingOrderId
        });
        
        // If not shipping, start shipping first
        if (!state.isShipping) {
          console.log("Starting shipping process");
          
          // Check if inventory is available
          if (state.inventory <= 0) {
            console.log("No inventory available for shipping");
            return;
          }
          
          // Find a pending order
          const pendingOrderIndex = state.orders.findIndex(
            (order: Order) => order.status === 'pending'
          );
          
          if (pendingOrderIndex === -1) {
            console.log("No pending orders found");
            return;
          }
          
          const order = state.orders[pendingOrderIndex];
          console.log("Selected order for shipping:", order);
          
          // Get current business
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness) {
            console.log("No current business found");
            return;
          }
          
          // Calculate shipping cost (based on order value)
          let shippingCost = Math.floor(order.value * 0.2); // 20% of order value
          
          // Apply shipping discount if technology is purchased
          const shippingDiscountTech = state.technologies.find(
            (t: Technology) => t.id === 'tech-4' && t.purchased
          );
          
          if (shippingDiscountTech) {
            const discountPercent = shippingDiscountTech.level * shippingDiscountTech.effect;
            const discount = Math.floor(shippingCost * discountPercent);
            shippingCost -= discount;
            console.log(`Applied shipping discount: -${discount} (${Math.round(discountPercent * 100)}%)`);
          }
          
          // No longer checking if business has enough money - allow negative balance
          console.log("Starting shipping regardless of money balance");
          
          // Deduct shipping cost
          const newBusinesses = [...state.businesses];
          const businessIndex = newBusinesses.findIndex(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          newBusinesses[businessIndex] = {
            ...currentBusiness,
            money: currentBusiness.money - shippingCost,
          };
          
          // Update order status to in_progress
          const newOrders = [...state.orders];
          newOrders[pendingOrderIndex] = {
            ...order,
            status: 'in_progress' as OrderStatus,
          };
          
          // Update statistics
          const newStatistics = {
            ...state.statistics,
            totalSpent: state.statistics.totalSpent + shippingCost,
          };
          
          console.log("Setting isShipping to true and resetting progress");
          set({
            isShipping: true,
            shippingProgress: 0,
            currentShippingOrderId: order.id,
            shippingCost,
            orders: newOrders,
            businesses: newBusinesses,
            statistics: newStatistics,
          });
          
          return;
        }
        
        // If already shipping, increment progress
        set((state: GameStoreState) => {
          console.log("Incrementing shipping progress");
          
          // Get shipping speed modifier from technologies
          const shippingSpeedTech = state.technologies.find(
            (t: Technology) => t.id === 'tech-2' && t.purchased
          );
          
          // Calculate increment amount (base + tech bonus)
          let incrementAmount = 33.33; // Base amount per tick (to complete in 3 seconds)
          if (shippingSpeedTech) {
            // Add 33% per level
            incrementAmount += incrementAmount * (shippingSpeedTech.level * 0.33);
          }
          
          // Increment shipping progress
          let newProgress = state.shippingProgress + incrementAmount;
          console.log("New shipping progress:", newProgress);
          
          // If progress is complete, ship the order
          if (newProgress >= 100) {
            console.log("Shipping complete");
            
            // Find the in-progress order
            const orderIndex = state.orders.findIndex(
              (order: Order) => order.id === state.currentShippingOrderId
            );
            
            if (orderIndex >= 0) {
              console.log("Found order to complete shipping");
              const order = state.orders[orderIndex];
              const newOrders = [...state.orders];
              newOrders[orderIndex] = {
                ...order,
                status: 'shipped' as OrderStatus,
                statusChangedAt: new Date(), // Add timestamp when shipped
              };
              
              // Update inventory
              const newInventory = state.inventory - 1;
              
              // Update business money and statistics
              const currentBusiness = state.businesses.find(
                (b: Business) => b.id === state.currentBusinessId
              );
              
              if (currentBusiness) {
                const newBusinesses = [...state.businesses];
                const businessIndex = newBusinesses.findIndex(
                  (b: Business) => b.id === state.currentBusinessId
                );
                
                // Calculate profit (order value - shipping cost)
                const profit = order.value - state.shippingCost;
                console.log("Shipping profit:", profit);
                
                newBusinesses[businessIndex] = {
                  ...currentBusiness,
                  money: currentBusiness.money + profit,
                  reputation: Math.min(100, currentBusiness.reputation + 1),
                };
                
                const newStatistics = {
                  ...state.statistics,
                  ordersShipped: state.statistics.ordersShipped + 1,
                  totalRevenue: state.statistics.totalRevenue + profit,
                  totalMoneyEarned: state.statistics.totalMoneyEarned + order.value, // Track gross revenue
                };
                
                const result = {
                  shippingProgress: 0,
                  inventory: newInventory,
                  isShipping: false,
                  currentShippingOrderId: null,
                  orders: newOrders,
                  businesses: newBusinesses,
                  statistics: newStatistics,
                };
                
                // Update leaderboard after shipping an order
                setTimeout(() => get().updateLeaderboard(), 0);
                
                // Check for Auto-Ship technology
                const autoShipTech = state.technologies.find(
                  (t: Technology) => t.id === 'tech-8' && t.purchased
                );
                
                // If Auto-Ship is purchased, start shipping a new order
                if (autoShipTech) {
                  // Use setTimeout to ensure the current state update completes first
                  setTimeout(() => {
                    const currentState = get();
                    // Only auto-ship if not already shipping, has inventory, and has pending orders
                    if (
                      !currentState.isShipping &&
                      currentState.inventory > 0 &&
                      currentState.orders.some(o => o.status === 'pending')
                    ) {
                      get().incrementShipping();
                    }
                  }, 0);
                }
                
                return result;
              }
            } else {
              console.log("Could not find order with ID:", state.currentShippingOrderId);
            }
          }
          
          return { shippingProgress: newProgress };
        });
      },
      
      checkExpiredOrders: () => {
        set((state: GameStoreState) => {
          const now = new Date();
          let ordersChanged = false;
          
          // Check each order
          let newOrders = state.orders.map(order => {
            // Skip orders that are already shipped or expired
            if (order.status === 'shipped' || order.status === 'expired') {
              return order;
            }
            
            // Check if deadline has passed
            if (new Date(order.deadline) < now) {
              ordersChanged = true;
              return {
                ...order,
                status: 'expired' as OrderStatus,
                statusChangedAt: now, // Add timestamp for when status changed
              };
            }
            
            return order;
          });
          
          // Filter out expired and shipped orders that are older than 1 minute
          newOrders = newOrders.filter(order => {
            if (order.status === 'expired') {
              // Calculate how long ago the order expired (in milliseconds)
              const expiryTime = order.statusChangedAt ? new Date(order.statusChangedAt).getTime() : new Date(order.deadline).getTime();
              const timeSinceExpiry = now.getTime() - expiryTime;
              
              // Keep only if less than 1 minute (60000 ms) has passed since expiry
              return timeSinceExpiry < 60000;
            }
            
            if (order.status === 'shipped') {
              // Calculate how long ago the order was shipped (in milliseconds)
              const shipTime = order.statusChangedAt ? new Date(order.statusChangedAt).getTime() : 0;
              const timeSinceShipped = now.getTime() - shipTime;
              
              // Keep only if less than 1 minute (60000 ms) has passed since shipping
              return timeSinceShipped < 60000;
            }
            
            return true; // Keep all other orders
          });
          
          if (!ordersChanged && newOrders.length === state.orders.length) return state;
          
          // Count newly expired orders
          const expiredOrders = newOrders.filter(
            order => order.status === 'expired' &&
            state.orders.find(o => o.id === order.id)?.status !== 'expired'
          );
          
          if (expiredOrders.length === 0) return { orders: newOrders };
          
          // Update business reputation
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (currentBusiness) {
            const newBusinesses = [...state.businesses];
            const businessIndex = newBusinesses.findIndex(
              (b: Business) => b.id === state.currentBusinessId
            );
            
            // Decrease reputation for each expired order
            const reputationLoss = expiredOrders.length * 2;
            
            newBusinesses[businessIndex] = {
              ...currentBusiness,
              reputation: Math.max(0, currentBusiness.reputation - reputationLoss),
            };
            
            // Update statistics
            const newStatistics = {
              ...state.statistics,
              ordersExpired: state.statistics.ordersExpired + expiredOrders.length,
            };
            
            return {
              orders: newOrders,
              businesses: newBusinesses,
              statistics: newStatistics,
            };
          }
          
          return { orders: newOrders };
        });
      },
      
      generateOrder: () => {
        set((state: GameStoreState) => {
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness) return state;
          
          // Calculate order value based on complexity
          const complexity = Math.floor(Math.random() * 3) + 1; // Random complexity 1-3
          const baseValue = 50 + (complexity * 10); // Base value increases with complexity
          let value = Math.floor(Math.random() * 20) + baseValue; // Random value with base + variation
          
          // Apply revenue boost if technology is purchased
          const revenueBoostTech = state.technologies.find(
            (t: Technology) => t.id === 'tech-5' && t.purchased
          );
          
          if (revenueBoostTech) {
            const boostPercent = revenueBoostTech.level * revenueBoostTech.effect;
            const boost = Math.floor(value * boostPercent);
            value += boost;
            console.log(`Applied revenue boost: +${boost} (${Math.round(boostPercent * 100)}%)`);
          }
          
          // Calculate production cost based on complexity
          const productionCost = 5 * complexity; // Production cost scales with complexity
          
          // Generate a new order
          const newOrder: Order = {
            id: generateId(),
            productType: currentBusiness.productType,
            status: 'pending',
            value: value,
            complexity: complexity,
            createdAt: new Date(),
            deadline: new Date(Date.now() + 60000 * (Math.random() * 2 + 1)), // 1-3 minutes deadline
          };
          
          const newStatistics = {
            ...state.statistics,
            ordersReceived: state.statistics.ordersReceived + 1,
          };
          
          return {
            orders: [...state.orders, newOrder],
            statistics: newStatistics,
          };
        });
      },
      
      completeOrder: (orderId: string) => {
        set((state: GameStoreState) => {
          const orderIndex = state.orders.findIndex((o: Order) => o.id === orderId);
          if (orderIndex === -1) return state;
          
          const newOrders = [...state.orders];
          newOrders[orderIndex] = {
            ...newOrders[orderIndex],
            status: 'completed',
          };
          
          return { orders: newOrders };
        });
      },
      
      purchaseTechnology: (technologyId: string) => {
        set((state: GameStoreState) => {
          const techIndex = state.technologies.findIndex((t: Technology) => t.id === technologyId);
          if (techIndex === -1) return state;
          
          const technology = state.technologies[techIndex];
          
          // Check if the business has enough money
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness || currentBusiness.money < technology.cost) {
            return state;
          }
          
          // Update the business money
          const newBusinesses = [...state.businesses];
          const businessIndex = newBusinesses.findIndex(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          newBusinesses[businessIndex] = {
            ...currentBusiness,
            money: currentBusiness.money - technology.cost,
          };
          
          // Update the technology
          const newTechnologies = [...state.technologies];
          newTechnologies[techIndex] = {
            ...technology,
            purchased: true,
            level: 1,
          };
          
          // Update statistics
          const newStatistics = {
            ...state.statistics,
            totalSpent: state.statistics.totalSpent + technology.cost,
          };
          
          const result = {
            businesses: newBusinesses,
            technologies: newTechnologies,
            statistics: newStatistics,
          };
          
          // Update leaderboard after purchasing technology
          setTimeout(() => get().updateLeaderboard(), 0);
          
          return result;
        });
      },
      
      upgradeTechnology: (technologyId: string) => {
        set((state: GameStoreState) => {
          const techIndex = state.technologies.findIndex((t: Technology) => t.id === technologyId);
          if (techIndex === -1) return state;
          
          const technology = state.technologies[techIndex];
          
          // Check if the technology is purchased
          if (!technology.purchased) return state;
          
          // Calculate upgrade cost (increases with level)
          const upgradeCost = technology.cost * (technology.level + 1);
          
          // Check if the business has enough money
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness || currentBusiness.money < upgradeCost) {
            return state;
          }
          
          // Update the business money
          const newBusinesses = [...state.businesses];
          const businessIndex = newBusinesses.findIndex(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          newBusinesses[businessIndex] = {
            ...currentBusiness,
            money: currentBusiness.money - upgradeCost,
          };
          
          // Update the technology
          const newTechnologies = [...state.technologies];
          newTechnologies[techIndex] = {
            ...technology,
            level: technology.level + 1,
          };
          
          // Update statistics
          const newStatistics = {
            ...state.statistics,
            totalSpent: state.statistics.totalSpent + upgradeCost,
          };
          
          const result = {
            businesses: newBusinesses,
            technologies: newTechnologies,
            statistics: newStatistics,
          };
          
          // Update leaderboard after upgrading technology
          setTimeout(() => get().updateLeaderboard(), 0);
          
          return result;
        });
      },
      
      // Leaderboard functions
      updateLeaderboard: () => {
        set((state: GameStoreState) => {
          const currentBusiness = state.businesses.find(
            (b: Business) => b.id === state.currentBusinessId
          );
          
          if (!currentBusiness) return state;
          
          // Check if business already exists in leaderboard
          const existingEntryIndex = state.leaderboard.findIndex(
            (entry) => entry.businessId === currentBusiness.id
          );
          
          let newLeaderboard = [...state.leaderboard];
          
          if (existingEntryIndex >= 0) {
            // Update existing entry
            newLeaderboard[existingEntryIndex] = {
              ...newLeaderboard[existingEntryIndex],
              businessName: currentBusiness.name,
              money: currentBusiness.money,
              totalMoneyEarned: state.statistics.totalMoneyEarned,
              ordersShipped: state.statistics.ordersShipped,
              lastUpdated: new Date(),
            };
          } else {
            // Add new entry
            newLeaderboard.push({
              businessId: currentBusiness.id,
              businessName: currentBusiness.name,
              money: currentBusiness.money,
              totalMoneyEarned: state.statistics.totalMoneyEarned,
              ordersShipped: state.statistics.ordersShipped,
              lastUpdated: new Date(),
            });
          }
          
          return { leaderboard: newLeaderboard };
        });
      },
      
      // Get money leaderboard (sorted by totalMoneyEarned)
      getMoneyLeaderboard: () => {
        const state = get();
        return [...state.leaderboard].sort((a, b) => b.totalMoneyEarned - a.totalMoneyEarned);
      },
      
      // Get shipping leaderboard (sorted by orders shipped)
      getShippingLeaderboard: () => {
        const state = get();
        return [...state.leaderboard].sort((a, b) => b.ordersShipped - a.ordersShipped);
      },
    }),
    {
      name: 'click-ship-tycoon-storage',
    }
  )
);