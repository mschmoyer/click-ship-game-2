# Click & Ship Tycoon - Version 4 Implementation Plan

## Overview

This document outlines the implementation plan for version 4 of the Click & Ship Tycoon game. The main focus is on improving gameplay mechanics, enhancing the leaderboard, refining the UI, and adding automation technologies.

## Key Features to Implement

### 1. Allow Negative Balance for Shipping

#### 1.1 Remove Money Check for Shipping
- Modify the `incrementShipping` function to remove the check that prevents shipping when the player doesn't have enough money
- Allow the business money to go negative when shipping costs are deducted
- Update any UI elements that might be affected by negative money values

#### 1.2 Update UI for Negative Balance
- Ensure negative money values are displayed correctly in the UI
- Consider adding a visual indicator when the balance is negative (e.g., red text)

### 2. Enhance Leaderboard with Total Money Earned

#### 2.1 Update Statistics Interface
- Add a new field `totalMoneyEarned` to the Statistics interface to track cumulative revenue
- Initialize this value to 0 for new games

#### 2.2 Update Revenue Tracking
- Modify the `incrementShipping` function to update the `totalMoneyEarned` statistic when an order is shipped
- Ensure this tracks the gross revenue (before shipping costs are deducted)

#### 2.3 Update Leaderboard Component
- Modify the Leaderboard component to display "Total Money Earned" instead of current money
- Update the leaderboard entry interface to include the total money earned
- Sort the money leaderboard based on total money earned rather than current money

### 3. Remove Emojis from Info Area

#### 3.1 Update Header UI
- Remove emoji icons from the header info section
- Adjust spacing and layout as needed to maintain a clean design
- Ensure text labels are clear and descriptive without the emojis

### 4. Update Technology Cost Color Indication

#### 4.1 Modify Technology Card UI
- Update the technology cost display to show green text when the player can afford it
- Keep red text for when the player cannot afford the technology
- Apply the same logic to both purchase and upgrade costs

### 5. Add Automation Technologies

#### 5.1 Auto-Build Technology
- Add a new technology with the following properties:
  - Name: "Auto-Build"
  - Description: "Automatically starts building a new product when the previous one is completed"
  - Type: "automation"
  - Cost: $1000
  - Effect: Boolean (on/off)
  - Icon: "🤖" or similar

#### 5.2 Auto-Ship Technology
- Add a new technology with the following properties:
  - Name: "Auto-Ship"
  - Description: "Automatically starts shipping a new order when the previous one is completed"
  - Type: "automation"
  - Cost: $1000
  - Effect: Boolean (on/off)
  - Icon: "📦" or similar

#### 5.3 Implement Auto-Build Logic
- Modify the `incrementProduction` function to check for the Auto-Build technology
- If the technology is purchased and production completes, automatically start a new production cycle
- Ensure this only happens if the player has enough money for the production cost

#### 5.4 Implement Auto-Ship Logic
- Modify the `incrementShipping` function to check for the Auto-Ship technology
- If the technology is purchased and shipping completes, automatically start shipping a new order
- Ensure this only happens if there are pending orders and inventory available

## Implementation Details

### 1. Allow Negative Balance for Shipping

```typescript
// Update incrementShipping function in gameStore.ts
incrementShipping: () => {
  // ...existing code...
  
  // If not shipping, start shipping first
  if (!state.isShipping) {
    // ...existing code...
    
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
    }
    
    // REMOVE THIS CHECK to allow negative balance
    // if (currentBusiness.money < shippingCost) {
    //   console.log("Not enough money to start shipping");
    //   return;
    // }
    
    // Deduct shipping cost (even if it makes the balance negative)
    const newBusinesses = [...state.businesses];
    const businessIndex = newBusinesses.findIndex(
      (b: Business) => b.id === state.currentBusinessId
    );
    
    newBusinesses[businessIndex] = {
      ...currentBusiness,
      money: currentBusiness.money - shippingCost,
    };
    
    // ...rest of the function...
  }
  
  // ...rest of the function...
}
```

### 2. Enhance Leaderboard with Total Money Earned

```typescript
// Update Statistics interface in gameStore.ts
export interface Statistics {
  ordersReceived: number;
  productsCreated: number;
  ordersShipped: number;
  ordersExpired: number;
  totalRevenue: number;
  totalSpent: number;
  totalMoneyEarned: number; // New field for cumulative revenue
}

// Update initialStatistics in gameStore.ts
const initialStatistics: Statistics = {
  ordersReceived: 0,
  productsCreated: 0,
  ordersShipped: 0,
  ordersExpired: 0,
  totalRevenue: 0,
  totalSpent: 0,
  totalMoneyEarned: 0, // Initialize to 0
};

// Update incrementShipping function to track total money earned
if (newProgress >= 100) {
  // ...existing code...
  
  // Calculate profit (order value - shipping cost)
  const profit = order.value - state.shippingCost;
  
  // Update business money and statistics
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
  
  // ...rest of the function...
}

// Update LeaderboardEntry interface
export interface LeaderboardEntry {
  businessId: string;
  businessName: string;
  money: number;
  totalMoneyEarned: number; // Add this field
  ordersShipped: number;
  lastUpdated: Date;
}

// Update updateLeaderboard function
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
        totalMoneyEarned: state.statistics.totalMoneyEarned, // Use the new field
        ordersShipped: state.statistics.ordersShipped,
        lastUpdated: new Date(),
      };
    } else {
      // Add new entry
      newLeaderboard.push({
        businessId: currentBusiness.id,
        businessName: currentBusiness.name,
        money: currentBusiness.money,
        totalMoneyEarned: state.statistics.totalMoneyEarned, // Use the new field
        ordersShipped: state.statistics.ordersShipped,
        lastUpdated: new Date(),
      });
    }
    
    return { leaderboard: newLeaderboard };
  });
},

// Update getMoneyLeaderboard function to sort by totalMoneyEarned
getMoneyLeaderboard: () => {
  const state = get();
  return [...state.leaderboard].sort((a, b) => b.totalMoneyEarned - a.totalMoneyEarned);
},
```

```tsx
// Update Leaderboard.tsx to display total money earned
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
  <h3 className="text-lg font-bold mb-4">
    Most Money Earned
  </h3>
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
```

### 3. Remove Emojis from Info Area

```tsx
// Update header in App.tsx
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
```

### 4. Update Technology Cost Color Indication

```tsx
// Update technology card in App.tsx
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
```

### 5. Add Automation Technologies

```typescript
// Add new technologies to initialTechnologies in gameStore.ts
const initialTechnologies: Technology[] = [
  // ...existing technologies...
  
  // Auto-Build Technology
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
  
  // Auto-Ship Technology
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
];

// Update incrementProduction function to implement auto-build
incrementProduction: () => {
  // ...existing code...
  
  // If progress is complete, create products
  if (newProgress >= 100) {
    // ...existing code...
    
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
  
  // ...rest of the function...
},

// Update incrementShipping function to implement auto-ship
incrementShipping: () => {
  // ...existing code...
  
  // If progress is complete, ship the order
  if (newProgress >= 100) {
    // ...existing code...
    
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
    
    return {
      shippingProgress: 0,
      inventory: newInventory,
      isShipping: false,
      currentShippingOrderId: null,
      orders: newOrders,
      businesses: newBusinesses,
      statistics: newStatistics,
    };
  }
  
  // ...rest of the function...
},
```

## Implementation Approach

### Phase 1: Allow Negative Balance for Shipping
1. Update the `incrementShipping` function to remove the money check
2. Test shipping with insufficient funds to ensure it works correctly

### Phase 2: Enhance Leaderboard with Total Money Earned
1. Update the Statistics interface to add the totalMoneyEarned field
2. Modify the incrementShipping function to track total money earned
3. Update the LeaderboardEntry interface and related functions
4. Update the Leaderboard component to display total money earned

### Phase 3: Remove Emojis from Info Area
1. Update the header in App.tsx to remove emoji icons
2. Adjust spacing and layout as needed

### Phase 4: Update Technology Cost Color Indication
1. Modify the technology card UI to show green text when affordable
2. Test with different money values to ensure correct color changes

### Phase 5: Add Automation Technologies
1. Add the new Auto-Build and Auto-Ship technologies to initialTechnologies
2. Implement the auto-build logic in the incrementProduction function
3. Implement the auto-ship logic in the incrementShipping function
4. Test both automation features to ensure they work correctly

## Conclusion

This implementation plan outlines the key features and changes needed for version 4 of the Click & Ship Tycoon game. The focus is on improving gameplay mechanics, enhancing the leaderboard, refining the UI, and adding automation technologies to provide a more engaging and streamlined player experience.