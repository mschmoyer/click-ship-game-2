# Click & Ship Tycoon - Version 3 Implementation Plan

## Overview

This document outlines the implementation plan for version 3 of the Click & Ship Tycoon game. The main focus is on enhancing the user interface, implementing the leaderboard feature, improving order management, and adding more depth to the technology system.

## Current State Analysis

The current implementation has:
- Basic game setup with business creation
- Game state management using Zustand
- UI components for production and shipping
- Progress bars for building and shipping
- Order generation and management system
- Technology system with upgrades
- Automatic progress incrementation for production and shipping

## Key Features to Implement

### 1. New Technology Categories

#### 1.1 Additional Technologies
- Add new technology categories:
  - Cheaper shipping costs (reduces shipping costs by percentage)
  - More revenue per order (increases order value)
  - More products per order (increases inventory gain when building)
- Implement effects of these technologies on gameplay
- Add visual indicators for these effects

#### 1.2 Technology Stats Display
- Show technology effects on orders and production containers
- Add tooltips to explain the effects
- Update UI to accommodate the new information

### 2. Emoji-Based Info Section

#### 2.1 Reputation Emoji System
- Implement a dynamic emoji system for reputation levels
- Create a mapping of reputation ranges to face emojis (happy to angry)
- Update the header info section to display the appropriate emoji

#### 2.2 Other Info Emojis
- Replace text labels with appropriate emojis:
  - Money: 💰 or 💵
  - Orders: 📦
  - Inventory: 🏭 or 🧰
- Ensure emojis are accessible and have tooltips

### 3. Leaderboard Implementation

#### 1.1 Leaderboard Data Structure
- Add leaderboard data to the game state
- Create sorting functions for different leaderboard categories
- Implement data persistence for leaderboard entries

#### 1.2 Leaderboard UI
- Design and implement the leaderboard view with two charts:
  - Most money earned
  - Most orders shipped
- Display business name for each entry
- Add visual styling for rankings (1st, 2nd, 3rd place indicators)

#### 1.3 Leaderboard Integration
- Update business statistics to feed into leaderboard data
- Ensure leaderboard updates when relevant statistics change

### 2. Order Management Improvements

#### 2.1 Order Cleanup
- Modify the `checkExpiredOrders` function to:
  - Filter out shipped orders that are older than 1 minute
  - Filter out expired orders that are older than 1 minute
- Add timestamps for when orders are shipped or expired

#### 2.2 Order Display Enhancements
- Update order card components to show more relevant information
- Improve visual distinction between different order statuses

### 3. UI Enhancements

#### 3.1 Theme Color Update
- Add a medium dark green color to the theme for header and footer
- Update the tailwind.config.js file to include the new color
- Apply the new color to the header and footer components

#### 3.2 Button Text Changes
- Change "Click to Build" to "Build Product"
- Change "Click to Ship" to "Ship Order"
- Update button styling for consistency

### 4. Technology System Enhancements

#### 4.1 Technology Level Names
- Add creative names for each technology level based on ShipStation features
- Update the technology interface to include level names
- Modify the technology card UI to display the level names

## Implementation Details

### 1. Leaderboard Implementation

#### 1.1 Game State Updates

```typescript
// Add to GameStoreState
interface LeaderboardEntry {
  businessId: string;
  businessName: string;
  money: number;
  ordersShipped: number;
  lastUpdated: Date;
}

interface GameStoreState {
  // Existing state...
  
  // New state
  leaderboard: LeaderboardEntry[];
  
  // New actions
  updateLeaderboard: () => void;
  getMoneyLeaderboard: () => LeaderboardEntry[];
  getShippingLeaderboard: () => LeaderboardEntry[];
}
```

#### 1.2 Leaderboard Functions

```typescript
// Update leaderboard
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
        ordersShipped: state.statistics.ordersShipped,
        lastUpdated: new Date(),
      };
    } else {
      // Add new entry
      newLeaderboard.push({
        businessId: currentBusiness.id,
        businessName: currentBusiness.name,
        money: currentBusiness.money,
        ordersShipped: state.statistics.ordersShipped,
        lastUpdated: new Date(),
      });
    }
    
    return { leaderboard: newLeaderboard };
  });
},

// Get money leaderboard (sorted by money)
getMoneyLeaderboard: () => {
  const state = get();
  return [...state.leaderboard].sort((a, b) => b.money - a.money);
},

// Get shipping leaderboard (sorted by orders shipped)
getShippingLeaderboard: () => {
  const state = get();
  return [...state.leaderboard].sort((a, b) => b.ordersShipped - a.ordersShipped);
},
```

#### 1.3 Leaderboard UI Component

```tsx
// Leaderboard.tsx
import React from 'react';
import { useGameStore } from '../store/gameStore';

const Leaderboard: React.FC = () => {
  const moneyLeaderboard = useGameStore((state) => state.getMoneyLeaderboard());
  const shippingLeaderboard = useGameStore((state) => state.getShippingLeaderboard());
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Money Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4">Most Money Earned</h3>
        {moneyLeaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet</p>
        ) : (
          <ul className="space-y-2">
            {moneyLeaderboard.slice(0, 10).map((entry, index) => (
              <li 
                key={entry.businessId}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  index === 1 ? 'bg-gray-100 dark:bg-gray-700/50' :
                  index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold w-8">{index + 1}.</span>
                  <span>{entry.businessName}</span>
                </div>
                <span className="font-medium text-green-600">${entry.money}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Shipping Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4">Most Orders Shipped</h3>
        {shippingLeaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet</p>
        ) : (
          <ul className="space-y-2">
            {shippingLeaderboard.slice(0, 10).map((entry, index) => (
              <li 
                key={entry.businessId}
                className={`flex justify-between items-center p-2 rounded ${
                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  index === 1 ? 'bg-gray-100 dark:bg-gray-700/50' :
                  index === 2 ? 'bg-amber-100 dark:bg-amber-900/20' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold w-8">{index + 1}.</span>
                  <span>{entry.businessName}</span>
                </div>
                <span className="font-medium text-purple-600">{entry.ordersShipped}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
```

### 2. Order Management Improvements

#### 2.1 Order Cleanup

The `checkExpiredOrders` function has already been updated to filter out expired orders that are older than 1 minute. We need to add similar functionality for shipped orders:

```typescript
// Update checkExpiredOrders function
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
    
    // Filter out expired orders that are older than 1 minute
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
    
    // Rest of the function remains the same...
  });
},
```

#### 2.2 Update Order Interface

```typescript
// Update Order interface
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
```

#### 2.3 Update incrementShipping Function

```typescript
// Update incrementShipping function to add statusChangedAt timestamp
if (newProgress >= 100) {
  // ...existing code...
  
  newOrders[orderIndex] = {
    ...order,
    status: 'shipped' as OrderStatus,
    statusChangedAt: new Date(), // Add timestamp when shipped
  };
  
  // ...rest of the function...
}
```

### 3. UI Enhancements

#### 3.1 Update Tailwind Config

```javascript
// tailwind.config.js
export default {
  // ...existing config...
  theme: {
    extend: {
      colors: {
        // ...existing colors...
        'header-footer': '#2E7D32', // Medium dark green
      },
      // ...rest of the theme...
    },
  },
  // ...rest of the config...
}
```

#### 3.2 Update Header and Footer Styling

```tsx
// Update header in App.tsx
<header className="bg-header-footer text-white shadow-md p-4">
  {/* Header content */}
</header>

// Update footer in App.tsx
<footer className="bg-header-footer text-white shadow-md p-2">
  {/* Footer content */}
</footer>
```

#### 3.3 Update Button Text

```tsx
// Update production button
<Button
  variant="primary"
  isFullWidth
  onClick={incrementProduction}
  disabled={isProducing || (currentBusiness ? currentBusiness.money < 10 : false)}
>
  {isProducing ? 'Building...' : 'Build Product'}
</Button>

// Update shipping button
<Button
  variant="accent"
  isFullWidth
  onClick={incrementShipping}
  disabled={isShipping || inventory === 0 || !orders.some(o => o.status === 'pending')}
>
  {isShipping ? 'Shipping...' : 'Ship Order'}
</Button>
```

### 4. Technology System Enhancements

#### 4.1 Update Technology Interface

```typescript
// Update Technology type
export type TechnologyType = 'efficiency' | 'cost' | 'revenue' | 'production';

// Update Technology interface
export interface Technology {
  id: string;
  name: string;
  description: string;
  type: TechnologyType;
  level: number;
  cost: number;
  effect: number;
  purchased: boolean;
  levelNames: string[]; // Array of names for each level
  icon?: string; // Emoji icon for the technology
}
```

#### 4.2 Update Initial Technologies

```typescript
// Update initial technologies with ShipStation-inspired level names
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
```

#### 4.3 Update Technology Effects in Game Logic

```typescript
// Update incrementProduction function to handle bulk production
incrementProduction: () => {
  // ... existing code ...
  
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
    }
    
    // Update inventory
    const newInventory = state.inventory + productsToAdd;
    
    // Update statistics
    const newStatistics = {
      ...state.statistics,
      productsCreated: state.statistics.productsCreated + productsToAdd,
    };
    
    // ... rest of the function ...
  }
}

// Update shipping cost calculation to apply discount
const calculateShippingCost = (orderValue: number, state: GameStoreState) => {
  // Base shipping cost (20% of order value)
  let shippingCost = Math.floor(orderValue * 0.2);
  
  // Apply shipping discount if technology is purchased
  const shippingDiscountTech = state.technologies.find(
    (t: Technology) => t.id === 'tech-4' && t.purchased
  );
  
  if (shippingDiscountTech) {
    const discountPercent = shippingDiscountTech.level * shippingDiscountTech.effect;
    shippingCost = Math.floor(shippingCost * (1 - discountPercent));
  }
  
  return shippingCost;
}

// Update order value calculation to apply revenue boost
const calculateOrderValue = (baseValue: number, state: GameStoreState) => {
  let orderValue = baseValue;
  
  // Apply revenue boost if technology is purchased
  const revenueBoostTech = state.technologies.find(
    (t: Technology) => t.id === 'tech-5' && t.purchased
  );
  
  if (revenueBoostTech) {
    const boostPercent = revenueBoostTech.level * revenueBoostTech.effect;
    orderValue = Math.floor(orderValue * (1 + boostPercent));
  }
  
  return orderValue;
}
```

#### 4.4 Update Technology Stats Display

```tsx
// Add technology effects to production container
<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
  {/* Show bulk production bonus if technology is purchased */}
  {technologies.find(t => t.id === 'tech-6' && t.purchased) && (
    <div className="flex items-center">
      <span className="mr-1">{technologies.find(t => t.id === 'tech-6')?.icon}</span>
      <span>
        Bulk Production: +{Math.floor(technologies.find(t => t.id === 'tech-6')?.level || 0)} products per build
      </span>
    </div>
  )}
</div>

// Add technology effects to shipping container
<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
  {/* Show shipping discount if technology is purchased */}
  {technologies.find(t => t.id === 'tech-4' && t.purchased) && (
    <div className="flex items-center">
      <span className="mr-1">{technologies.find(t => t.id === 'tech-4')?.icon}</span>
      <span>
        Shipping Discount: {Math.floor((technologies.find(t => t.id === 'tech-4')?.level || 0) * 15)}%
      </span>
    </div>
  )}
  
  {/* Show revenue boost if technology is purchased */}
  {technologies.find(t => t.id === 'tech-5' && t.purchased) && (
    <div className="flex items-center">
      <span className="mr-1">{technologies.find(t => t.id === 'tech-5')?.icon}</span>
      <span>
        Revenue Boost: +{Math.floor((technologies.find(t => t.id === 'tech-5')?.level || 0) * 20)}%
      </span>
    </div>
  )}
</div>
```

#### 4.5 Update Technology Card UI

```tsx
// Update technology card in App.tsx
<div>
  <div className="flex items-center mb-1">
    <span className="text-xl mr-2">{tech.icon}</span>
    <h3 className="font-medium">{tech.name}</h3>
  </div>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    {tech.description}
  </p>
  {tech.purchased && (
    <div className="mt-1">
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Level {tech.level}: <span className="font-medium">{tech.levelNames[tech.level]}</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        {tech.level > 0 && (
          tech.type === 'production'
            ? `+${tech.level * tech.effect} products per build`
            : `${Math.round(tech.effect * tech.level * 100)}% ${tech.type === 'cost' ? 'discount' : 'bonus'}`
        )}
      </p>
    </div>
  )}
  
  {tech.purchased && tech.level < tech.levelNames.length - 1 && (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Upgrade to: <span className="font-medium">{tech.levelNames[tech.level + 1]}</span>
        </span>
        <span className="text-sm font-medium text-red-600">
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
  )}
</div>
```

### 5. Emoji-Based Info Section

#### 5.1 Reputation Emoji Mapping

```typescript
// Reputation emoji mapping function
const getReputationEmoji = (reputation: number): string => {
  if (reputation >= 90) return '😄'; // Very happy
  if (reputation >= 70) return '🙂'; // Happy
  if (reputation >= 50) return '😐'; // Neutral
  if (reputation >= 30) return '🙁'; // Sad
  if (reputation >= 10) return '😟'; // Worried
  return '😡'; // Angry
};
```

#### 5.2 Update Header Info Section

```tsx
// Update header info section
<header className="bg-header-footer text-white shadow-md p-4">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="font-bold">{currentBusiness?.name}</h1>
      <p className="text-sm text-gray-200">{currentBusiness?.productType}</p>
    </div>
    <div className="flex gap-6">
      <div className="text-right flex items-center">
        <span className="text-2xl mr-2" title="Money">💰</span>
        <div>
          <p className="text-xs text-gray-200">Money</p>
          <p className="font-bold text-green-300">${currentBusiness?.money}</p>
        </div>
      </div>
      <div className="text-right flex items-center">
        <span className="text-2xl mr-2" title="Reputation">
          {getReputationEmoji(currentBusiness?.reputation || 0)}
        </span>
        <div>
          <p className="text-xs text-gray-200">Reputation</p>
          <p className="font-bold text-blue-300">{currentBusiness?.reputation}%</p>
        </div>
      </div>
      <div className="text-right flex items-center">
        <span className="text-2xl mr-2" title="Inventory">🧰</span>
        <div>
          <p className="text-xs text-gray-200">Inventory</p>
          <p className="font-bold text-amber-300">{inventory}</p>
        </div>
      </div>
      <div className="text-right flex items-center">
        <span className="text-2xl mr-2" title="Orders Shipped">📦</span>
        <div>
          <p className="text-xs text-gray-200">Orders Shipped</p>
          <p className="font-bold text-purple-300">{statistics.ordersShipped}</p>
        </div>
      </div>
    </div>
  </div>
</header>
```

## Implementation Approach

### Phase 1: UI Enhancements
1. Update tailwind.config.js with the new header-footer color
2. Apply the new color to the header and footer components
3. Update button text from "Click to Build" to "Build Product" and "Click to Ship" to "Ship Order"
4. Implement emoji-based info section in the header
5. Create reputation emoji mapping function

### Phase 2: Order Management Improvements
1. Update the Order interface to include statusChangedAt
2. Modify the incrementShipping function to set statusChangedAt when an order is shipped
3. Update the checkExpiredOrders function to filter out both expired and shipped orders that are older than 1 minute

### Phase 3: Technology System Enhancements
1. Update the Technology interface to include levelNames and icons
2. Add new technology categories (shipping discount, revenue boost, bulk production)
3. Implement technology effects in game logic
4. Add technology stats display to production and shipping containers
5. Update the technology card UI to display the level names and icons

### Phase 4: Leaderboard Implementation
1. Add leaderboard data structure to the game state
2. Implement leaderboard sorting functions
3. Create the Leaderboard component
4. Update the App.tsx file to display the leaderboard in the leaderboard view

## Conclusion

This implementation plan outlines the key features and changes needed for version 3 of the Click & Ship Tycoon game. The focus is on enhancing the user interface, implementing the leaderboard feature, improving order management, and adding more depth to the technology system.