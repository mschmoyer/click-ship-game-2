# Click & Ship Tycoon - Version 2 Implementation Plan

## Overview

This document outlines the implementation plan for version 2 of the Click & Ship Tycoon game. The main focus is on enhancing the core gameplay mechanics, implementing technology upgrades, and adding economic elements to make the game more engaging and challenging.

## Current State Analysis

The current implementation has:
- Basic game setup with business creation
- Game state management using Zustand
- UI components for production and shipping
- Progress bars for building and shipping
- Order generation system
- Basic technology system (not fully implemented in UI)

## Key Features to Implement

### 1. Production and Shipping Mechanics

#### 1.1 Inventory System
- Add inventory tracking to the game state
- Track number of products built but not yet shipped
- Display inventory count in the UI

#### 1.2 Production Process
- Update `incrementProduction` to:
  - Start building a product if none is in progress
  - Increment progress if already building
  - Add to inventory when complete
  - Apply production costs when starting production
  - Apply technology effects to production speed

#### 1.3 Shipping Process
- Update `incrementShipping` to:
  - Check if inventory is available
  - Check if pending orders exist
  - Select a pending order and mark it as "in_progress"
  - Start shipping if conditions are met
  - Increment progress if already shipping
  - Mark order as "shipped" when complete
  - Apply shipping costs
  - Apply technology effects to shipping speed

#### 1.4 Progress Bar Animations
- Enhance progress bars to show active animations when in progress
- Add visual indicators for active processes

### 2. Economic System

#### 2.1 Cost Mechanics
- Add production costs based on product complexity
- Add shipping costs based on order value
- Update business money calculations to account for costs
- Ensure player starts with enough money (increase starting money)

#### 2.2 UI Updates
- Add orders shipped count to the header info area
- Display production and shipping costs in the UI
- Show profit/loss calculations for orders

### 3. Technology Upgrades

#### 3.1 Technology Implementation
- Implement the technology view in the UI
- Create UI components for technology cards
- Add purchase and upgrade buttons
- Show technology effects and costs

#### 3.2 Technology Effects
- Implement shipping speed technology (33% increase)
- Implement build speed technology (33% increase)
- Implement order frequency technology (25% faster)
- Apply technology effects to relevant game mechanics

### 4. Order Management

#### 4.1 Order Expiration System
- Implement a system to check for expired orders
- Add a timer display for order deadlines
- Update order status to "expired" when deadline is reached
- Apply penalties for expired orders (money and reputation)

#### 4.2 Order Status Visualization
- Enhance order cards to show:
  - Time remaining until expiration
  - Current status with clear visual indicators
  - Highlight in-progress orders

## Implementation Details

### Game State Updates

```typescript
// Add to GameStoreState
interface GameStoreState {
  // Existing state...
  
  // New state
  inventory: number;
  isProducing: boolean;
  isShipping: boolean;
  currentShippingOrderId: string | null;
  productionCost: number;
  shippingCost: number;
  
  // New actions
  startProduction: () => void;
  startShipping: () => void;
  checkExpiredOrders: () => void;
}
```

### Production and Shipping Logic

#### Production Process

```typescript
// Start production
startProduction: () => {
  set((state: GameStoreState) => {
    // Check if already producing
    if (state.isProducing) return state;
    
    // Get current business
    const currentBusiness = state.businesses.find(
      (b: Business) => b.id === state.currentBusinessId
    );
    
    if (!currentBusiness) return state;
    
    // Calculate production cost (based on business type)
    const productionCost = 10; // Base cost
    
    // Check if business has enough money
    if (currentBusiness.money < productionCost) {
      // Not enough money
      return state;
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
    
    return {
      isProducing: true,
      productionProgress: 0,
      productionCost,
      businesses: newBusinesses,
      statistics: newStatistics,
    };
  });
},

// Update incrementProduction
incrementProduction: () => {
  set((state: GameStoreState) => {
    // If not producing, start production
    if (!state.isProducing) {
      // Call startProduction
      state.startProduction();
      return state;
    }
    
    // Get production speed modifier from technologies
    const productionSpeedTech = state.technologies.find(
      (t: Technology) => t.id === 'tech-1' && t.purchased
    );
    
    // Calculate increment amount (base + tech bonus)
    let incrementAmount = 10; // Base amount
    if (productionSpeedTech) {
      // Add 33% per level
      incrementAmount += incrementAmount * (productionSpeedTech.level * 0.33);
    }
    
    // Increment production progress
    let newProgress = state.productionProgress + incrementAmount;
    
    // If progress is complete, create a product
    if (newProgress >= 100) {
      newProgress = 0;
      
      // Update inventory
      const newInventory = state.inventory + 1;
      
      // Update statistics
      const newStatistics = {
        ...state.statistics,
        productsCreated: state.statistics.productsCreated + 1,
      };
      
      return {
        productionProgress: newProgress,
        inventory: newInventory,
        isProducing: false,
        statistics: newStatistics,
      };
    }
    
    return { productionProgress: newProgress };
  });
},
```

#### Shipping Process

```typescript
// Start shipping
startShipping: () => {
  set((state: GameStoreState) => {
    // Check if already shipping
    if (state.isShipping) return state;
    
    // Check if inventory is available
    if (state.inventory <= 0) return state;
    
    // Find a pending order
    const pendingOrderIndex = state.orders.findIndex(
      (order: Order) => order.status === 'pending'
    );
    
    if (pendingOrderIndex === -1) return state; // No pending orders
    
    const order = state.orders[pendingOrderIndex];
    
    // Get current business
    const currentBusiness = state.businesses.find(
      (b: Business) => b.id === state.currentBusinessId
    );
    
    if (!currentBusiness) return state;
    
    // Calculate shipping cost (based on order value)
    const shippingCost = Math.floor(order.value * 0.2); // 20% of order value
    
    // Check if business has enough money
    if (currentBusiness.money < shippingCost) {
      // Not enough money
      return state;
    }
    
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
      status: 'in_progress',
    };
    
    // Update statistics
    const newStatistics = {
      ...state.statistics,
      totalSpent: state.statistics.totalSpent + shippingCost,
    };
    
    return {
      isShipping: true,
      shippingProgress: 0,
      currentShippingOrderId: order.id,
      shippingCost,
      orders: newOrders,
      businesses: newBusinesses,
      statistics: newStatistics,
    };
  });
},

// Update incrementShipping
incrementShipping: () => {
  set((state: GameStoreState) => {
    // If not shipping, start shipping
    if (!state.isShipping) {
      // Call startShipping
      state.startShipping();
      return state;
    }
    
    // Get shipping speed modifier from technologies
    const shippingSpeedTech = state.technologies.find(
      (t: Technology) => t.id === 'tech-2' && t.purchased
    );
    
    // Calculate increment amount (base + tech bonus)
    let incrementAmount = 10; // Base amount
    if (shippingSpeedTech) {
      // Add 33% per level
      incrementAmount += incrementAmount * (shippingSpeedTech.level * 0.33);
    }
    
    // Increment shipping progress
    let newProgress = state.shippingProgress + incrementAmount;
    
    // If progress is complete, ship the order
    if (newProgress >= 100) {
      newProgress = 0;
      
      // Find the in-progress order
      const orderIndex = state.orders.findIndex(
        (order: Order) => order.id === state.currentShippingOrderId
      );
      
      if (orderIndex >= 0) {
        const order = state.orders[orderIndex];
        const newOrders = [...state.orders];
        newOrders[orderIndex] = {
          ...order,
          status: 'shipped',
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
          
          newBusinesses[businessIndex] = {
            ...currentBusiness,
            money: currentBusiness.money + profit,
            reputation: Math.min(100, currentBusiness.reputation + 1),
          };
          
          const newStatistics = {
            ...state.statistics,
            ordersShipped: state.statistics.ordersShipped + 1,
            totalRevenue: state.statistics.totalRevenue + profit,
          };
          
          return {
            shippingProgress: newProgress,
            inventory: newInventory,
            isShipping: false,
            currentShippingOrderId: null,
            orders: newOrders,
            businesses: newBusinesses,
            statistics: newStatistics,
          };
        }
      }
    }
    
    return { shippingProgress: newProgress };
  });
},
```

### Order Expiration System

```typescript
// Check for expired orders
checkExpiredOrders: () => {
  set((state: GameStoreState) => {
    const now = new Date();
    let ordersChanged = false;
    
    // Check each order
    const newOrders = state.orders.map(order => {
      // Skip orders that are already shipped or expired
      if (order.status === 'shipped' || order.status === 'expired') {
        return order;
      }
      
      // Check if deadline has passed
      if (new Date(order.deadline) < now) {
        ordersChanged = true;
        return {
          ...order,
          status: 'expired',
        };
      }
      
      return order;
    });
    
    if (!ordersChanged) return state;
    
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
```

### Technology Implementation

```typescript
// Update technology definitions
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
  },
];
```

### UI Updates

#### Header Info Update
- Add orders shipped count to the header
- Display inventory count

#### Technology View Implementation
- Create technology cards
- Add purchase and upgrade buttons
- Show technology effects and costs

#### Order Card Enhancements
- Add time remaining indicator
- Highlight in-progress orders
- Show production and shipping costs

## Implementation Approach

### Phase 1: Core Mechanics
1. Update game state with inventory and process tracking
2. Implement production and shipping logic
3. Update progress bar animations

### Phase 2: Economic System
1. Implement production and shipping costs
2. Update UI to show costs and profits
3. Adjust starting money

### Phase 3: Technology System
1. Implement technology view
2. Create technology cards
3. Implement technology effects

### Phase 4: Order Management
1. Implement order expiration system
2. Enhance order visualization
3. Add timer displays

## Order Expiration Implementation

For order expiration, we'll use a combination of:

1. **Regular Polling**: Set up a useEffect in the App component that calls `checkExpiredOrders` at regular intervals (e.g., every 5 seconds).

2. **API Integration**: When making API calls to the backend, we'll include game state information in the responses, allowing the backend to check for expired orders and update the state accordingly.

The polling approach is simpler to implement but less efficient. For a more robust solution, we could implement a WebSocket connection to receive real-time updates from the server, but that would be more complex.

## Conclusion

This implementation plan outlines the key features and changes needed for version 2 of the Click & Ship Tycoon game. The focus is on enhancing the core gameplay mechanics, implementing technology upgrades, and adding economic elements to make the game more engaging and challenging.