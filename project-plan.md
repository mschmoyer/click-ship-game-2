# Click & Ship Tycoon - Project Plan

## Game Concept

"Click & Ship Tycoon" is a mobile-friendly web game in the idle clicker genre where players manage an order fulfillment business. The core gameplay loop involves:

1. **Receiving orders** automatically (increasing in speed and complexity over time)
2. **Building products** by clicking to fulfill these orders
3. **Shipping orders** by clicking to send completed products
4. **Managing time constraints** (expired orders result in refunds, lost money, and reputation damage)
5. **Purchasing technologies** to improve efficiency (based on ShipStation app features)

The game will feature a colorful, engaging art style with satisfying animations and sound effects to make the clicking and management aspects enjoyable.

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite (for fast development and optimized production builds)
- **State Management**: Redux Toolkit or Zustand
- **Styling**: Tailwind CSS (for responsive design) with custom animations
- **UI Components**: Custom components with potential use of a lightweight component library
- **Animations**: Framer Motion or React Spring

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI (high performance, easy to use)
- **API Documentation**: Automatic Swagger UI via FastAPI
- **Authentication**: JWT-based auth system

### Database
- **Solution**: PostgreSQL for both development and production
- **ORM**: SQLAlchemy with Alembic for migrations

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or similar PaaS
- **Database**: Managed PostgreSQL service

## Game Features

### Core Mechanics
1. **Order Management**
   - Automatic order generation with increasing complexity over time
   - Time limits for order fulfillment
   - Order queue management
   - Order priority system

2. **Production System**
   - Click-based product building
   - Different product types with varying complexity
   - Production efficiency upgrades
   - Multi-step manufacturing for complex products

3. **Shipping System**
   - Click-based order shipping
   - Shipping efficiency upgrades
   - Batch shipping capabilities
   - Shipping validation and quality control

4. **Technology Upgrades**
   - ShipStation-inspired technology tree
   - Automation technologies
   - Efficiency boosters
   - Capacity upgrades

5. **Economy & Reputation**
   - Revenue tracking
   - Expense management
   - Reputation system affected by order timeliness
   - Reinvestment strategies

### User Experience
1. **Game Interface**
   - Initial Setup Screen: Enter business name and product type
   - Orders View: Displays incoming orders with timers
   - Game Space: Areas for product creation and shipping with progress bars
   - Info View: Shows money, reputation, statistics
   - Technology Menu: Upgrade options
   - Leaderboard: Top players by revenue, orders, and products
   - New Game Button: Option to start fresh

2. **UI/UX Design**
   - Clean, colorful interface with fulfillment/logistics theme
   - Mobile-focused responsive design
   - Satisfying visual and audio feedback
   - Easy one-handed play on mobile
   - Visual progress bars that speed up with technology upgrades

3. **Social Features**
   - Leaderboards for revenue, orders shipped, and products created
   - Business name and product type displayed on leaderboards
   - Achievement system
   - Optional social sharing

## Data Model

### Core Entities

1. **User**
   - Authentication details
   - Settings/preferences

2. **Business**
   - Business name
   - Product type
   - Owner (User FK)
   - Reputation score
   - Currency balance
   - Creation date
   - Last played date

3. **Orders**
   - Order ID and details
   - Business FK
   - Product requirements
   - Time received
   - Deadline
   - Status (pending, in progress, completed, shipped, expired)
   - Value
   - Complexity level

3. **Products**
   - Product types
   - Components required
   - Production time
   - Value
   - Attributes (size, complexity, etc.)

4. **Technologies**
   - Type (automation, efficiency, capacity)
   - Business FK
   - Level
   - Cost
   - Effects/bonuses
   - Prerequisites

5. **Statistics**
   - Business FK
   - Orders received
   - Products created
   - Orders shipped
   - Orders expired
   - Revenue generated
   - Money spent on technologies
   - Efficiency metrics

6. **Achievements**
   - Business FK
   - Milestone tracking
   - Unlock conditions
   - Rewards

## Development Roadmap

### Phase 1: MVP Setup (2 weeks)
- Set up Vite + React project with mobile-focused responsive design
- Implement basic UI layout (initial setup screen, orders view, game space, info view)
- Create basic clicking mechanics with progress bars for building and shipping
- Implement "New Game" functionality
- Develop simple backend API with FastAPI
- Set up PostgreSQL database with basic schema
- Implement user authentication and multiple business support

### Phase 2: Core Gameplay (3 weeks)
- Implement order generation system with increasing complexity
- Develop product building mechanics
- Create order shipping and validation system
- Add time constraints and expiration mechanics
- Implement basic technology upgrades
- Enhance visual feedback and animations

### Phase 3: Economy & Progression (2 weeks)
- Implement reputation system
- Add achievements and statistics tracking
- Create leaderboard functionality
- Develop tutorial and onboarding
- Add sound effects and music
- Balance economy and progression

### Phase 4: Polish & Launch (1 week)
- Performance optimization
- Cross-browser/device testing
- Final balancing adjustments
- Prepare for deployment
- Launch marketing assets

## Technical Architecture

### Frontend Structure
```
src/
  assets/           # Images, sounds, etc.
  components/       # Reusable UI components
    ui/             # Basic UI elements
    game/           # Game-specific components
      orders/       # Order-related components
      products/     # Product-related components
      shipping/     # Shipping-related components
  features/         # Feature-based modules
    auth/           # Authentication
    orders/         # Order management
    production/     # Product building
    shipping/       # Order shipping
    technologies/   # Technology upgrades
    leaderboard/    # Leaderboard functionality
  hooks/            # Custom React hooks
  store/            # State management
  utils/            # Helper functions
  App.jsx           # Main app component
  main.jsx          # Entry point
```

### Backend Structure
```
app/
  api/              # API endpoints
    v1/             # API version
      auth/         # Authentication endpoints
      users/        # User endpoints
      orders/       # Order endpoints
      products/     # Product endpoints
      technologies/ # Technology endpoints
      leaderboard/  # Leaderboard endpoints
  core/             # Core application code
    config/         # Configuration
    db/             # Database models and migrations
    security/       # Security utilities
  services/         # Business logic
    order_service/  # Order generation and management
    game_service/   # Game state and progression
    stats_service/  # Statistics tracking
  utils/            # Helper functions
  main.py           # Application entry point
```

### Database Schema (Simplified)
```
users
  id: UUID
  username: String
  email: String
  password_hash: String
  created_at: DateTime
  
businesses
  id: UUID
  user_id: UUID (FK)
  name: String
  product_type: String
  currency: Integer
  reputation: Float
  click_power: Float
  created_at: DateTime
  last_played_at: DateTime
  
orders
  id: UUID
  business_id: UUID (FK)
  product_type_id: UUID (FK)
  status: String (pending, in_progress, completed, shipped, expired)
  created_at: DateTime
  deadline: DateTime
  value: Integer
  complexity: Integer
  
product_types
  id: UUID
  name: String
  base_production_time: Integer
  base_value: Integer
  components_required: JSON
  image_url: String
  
technologies
  id: UUID
  name: String
  description: String
  cost: Integer
  effect_type: String
  effect_value: Float
  prerequisite_id: UUID (FK, nullable)
  
business_technologies
  id: UUID
  business_id: UUID (FK)
  technology_id: UUID (FK)
  level: Integer
  purchased_at: DateTime
  
statistics
  id: UUID
  business_id: UUID (FK)
  orders_received: Integer
  products_created: Integer
  orders_shipped: Integer
  orders_expired: Integer
  total_revenue: Integer
  total_spent: Integer
  last_updated: DateTime
```

## Mobile Design Approach

The game will focus exclusively on mobile design for the initial version:

### Mobile Design
- Single-column layout with tabbed navigation for different views
- Large touch targets for clicking production and shipping buttons
- Bottom navigation for accessing menus
- Swipe gestures for navigating between orders
- Portrait orientation optimized for one-handed play
- Responsive to different mobile screen sizes
- Touch-friendly UI elements with appropriate spacing
- Optimized for performance on mobile devices

## Art Style & Visual Design

- Colorful, slightly cartoonish art style with a modern logistics/fulfillment theme
- Clean, flat design with subtle shadows for depth
- Vibrant color palette with accent colors for different product types
- Satisfying animations for clicks, order completions, and shipping actions
- Visual feedback for successful/failed order fulfillment
- Progress indicators for order deadlines
- Achievement badges and milestone celebrations

## Game Progression & Balance

- Gradually increasing order complexity and frequency
- Technology upgrades that provide meaningful but balanced advantages
- Reputation system that affects order frequency and value
- Balanced economy to ensure consistent challenge
- Multiple strategies for success (speed vs. efficiency vs. volume)

## Monetization Options (Future Consideration)

- Premium currency
- Cosmetic upgrades
- Time boosters
- Special limited-time events
- Battle pass system

## Next Steps

1. Set up development environment with Vite and React
2. Create initial project structure following the technical architecture
3. Implement initial business setup screen (name and product type)
4. Implement basic UI layout with the main game views
5. Design initial order generation system
6. Implement progress bars and clicking mechanics for production and shipping
7. Add "New Game" functionality
8. Set up backend API with FastAPI
9. Implement PostgreSQL database with initial schema supporting multiple businesses