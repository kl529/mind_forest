# Mind Forest - Code Structure Guide

## 📂 Project Architecture

```
mind_forest/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx            # Home screen (Terrarium + Entry)
│   │   ├── calendar.tsx         # Calendar view with stress colors
│   │   └── stats.tsx            # Statistics and trends
│   ├── _layout.tsx              # Root layout (providers, fonts)
│   └── +not-found.tsx           # 404 error page
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Platform-specific components
│   │   ├── IconSymbol.tsx       # Icon wrapper (SF Symbols/fallback)
│   │   ├── IconSymbol.ios.tsx   # iOS-specific icons
│   │   ├── TabBarBackground.tsx # Tab bar styling
│   │   └── TabBarBackground.ios.tsx
│   ├── TerrariumView.tsx        # Dynamic terrarium visualization
│   ├── InputModal.tsx           # Activity logging bottom sheet
│   ├── ThemedText.tsx           # Themed text component
│   ├── ThemedView.tsx           # Themed view component
│   └── HapticTab.tsx            # Tab with haptic feedback
│
├── utils/                        # Business logic and utilities
│   ├── stressCalculator.ts      # Stress level algorithms
│   └── dataStorage.ts           # AsyncStorage wrapper
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Core data models
│
├── constants/                    # App constants
│   └── Colors.ts                # Color theme definitions
│
├── hooks/                        # Custom React hooks
│   └── useColorScheme.ts        # Color scheme detection
│
└── assets/                       # Static assets
    ├── images/
    └── fonts/
```

---

## 🏗️ Architecture Overview

### Layer 1: Screens (app/)
**Responsibility**: User interface and screen-level state management

- **Home Screen** (`index.tsx`):
  - Displays terrarium visualization
  - Shows stress notifications/suggestions
  - Opens activity input modal
  - Manages screen-level loading state

- **Calendar Screen** (`calendar.tsx`):
  - Monthly calendar view
  - Color-coded stress level indicators
  - Month navigation
  - Stress level legend

- **Stats Screen** (`stats.tsx`):
  - Line chart visualization
  - Monthly trend analysis
  - Summary statistics
  - Previous month comparison

### Layer 2: Components (components/)
**Responsibility**: Reusable UI elements with single responsibility

- **TerrariumView**: Visual representation of stress state
- **InputModal**: Activity logging form
- **Themed Components**: Consistent styling across light/dark modes
- **UI Components**: Platform-specific UI elements

### Layer 3: Business Logic (utils/)
**Responsibility**: Core algorithms and data management

- **stressCalculator.ts**:
  - Calculates current stress level
  - Generates personalized notifications
  - Determines terrarium state
  - Analyzes stress patterns

- **dataStorage.ts**:
  - AsyncStorage CRUD operations
  - Data persistence
  - Query helpers
  - Data cleanup

### Layer 4: Type Definitions (types/)
**Responsibility**: TypeScript interfaces and types

- Core data models (ActivityEntry, etc.)
- API shapes
- Component props

---

## 🔄 Data Flow

```
User Input
    ↓
InputModal (Component)
    ↓
HomeScreen.handleSaveEntry()
    ↓
DataStorage.saveActivity() (Persistence)
    ↓
AsyncStorage (React Native)
    ↓
DataStorage.getCurrentStressLevel() (Retrieval)
    ↓
StressCalculator.calculateStressLevel() (Business Logic)
    ↓
Screen State Update
    ↓
TerrariumView Re-render (Visual Feedback)
```

---

## 🎨 Component Hierarchy

```
App Root
└── TabLayout
    ├── Home Screen
    │   ├── TerrariumView
    │   ├── Notification Section
    │   │   └── ThemedText (suggestions)
    │   ├── Add Button
    │   └── InputModal
    │       ├── Category Toggle
    │       ├── Activity Picker
    │       ├── Intensity Slider
    │       └── Notes Input
    │
    ├── Calendar Screen
    │   ├── Month Navigation
    │   ├── Week Header
    │   ├── Calendar Grid
    │   └── Legend
    │
    └── Stats Screen
        ├── Legend
        ├── Line Chart
        └── Summary Stats
```

---

## 📊 Data Models

### ActivityEntry
```typescript
interface ActivityEntry {
  id: string;              // Unique identifier
  date: Date;              // When activity occurred
  category: 'stress' | 'relief';
  activity: string;        // Activity name
  intensity: number;       // 1-5 scale
  notes?: string;          // Optional user notes
}
```

### StressLevel
- Calculated value: 1-10 scale
- Based on recent activity entries
- Updated after each new entry
- Stored separately from entries

---

## 🎯 Key Design Patterns

### 1. Separation of Concerns
- Screens handle UI and user interaction
- Utils handle business logic and data
- Components are presentational and reusable

### 2. Single Source of Truth
- AsyncStorage is the single data source
- All screens read from same storage
- DataStorage utility provides consistent interface

### 3. Prop Drilling Avoidance
- Each screen manages its own data loading
- No complex state management needed (yet)
- Components receive only props they need

### 4. Platform Adaptation
- Platform-specific components (`.ios.tsx`, `.tsx`)
- Conditional rendering based on Platform.OS
- Graceful fallbacks for platform features

---

## 🔧 Key Utilities

### StressCalculator
**Purpose**: Convert activity data into meaningful stress metrics

**Key Functions**:
- `calculateStressLevel(activities)`: Compute current stress (1-10)
- `getStressNotification(level, activities)`: Generate personalized tips
- `getTerrariumState(level)`: Determine visual state

**Algorithm Considerations**:
- Time decay (recent activities weighted more)
- Balance of stress vs relief
- Pattern recognition (most common stressors/relievers)

### DataStorage
**Purpose**: Consistent interface to AsyncStorage

**Key Functions**:
- `saveActivity(entry)`: Persist new entry
- `getActivitiesForDateRange(start, end)`: Query by date
- `getCurrentStressLevel()`: Get latest stress value
- `calculateAndSaveStressLevel()`: Update stress metric

**Data Integrity**:
- Automatic cleanup (max 365 days, 1000 entries)
- Data validation before save
- Error handling for storage failures

---

## 🚀 Current State

### ✅ Implemented
- Core data models
- Basic CRUD operations
- Three main screens
- Activity logging flow
- Visual terrarium (static states)
- Calendar layout
- Stats chart visualization

### 🚧 Partially Implemented
- Calendar uses mock data (needs DataStorage integration)
- Stats uses mock data (needs DataStorage integration)
- Stress calculation algorithm (needs refinement)
- Terrarium states (needs more visual polish)

### 📝 Not Yet Implemented
- Onboarding flow
- Push notifications
- Data export/import
- User authentication
- Cloud sync
- Advanced analytics

---

## 🧹 Code Cleanup Completed

### Removed Components
- `HelloWave.tsx` - Unused demo component
- `ParallaxScrollView.tsx` - Not needed for current screens
- `Collapsible.tsx` - Not used in any screen
- `ExternalLink.tsx` - No external links needed

### Current Component Count
- **Core Screens**: 3 (Home, Calendar, Stats)
- **Custom Components**: 2 (TerrariumView, InputModal)
- **Themed Components**: 3 (ThemedView, ThemedText, HapticTab)
- **UI Components**: 3 (IconSymbol, TabBarBackground)
- **Total**: 11 focused components

---

## 📐 Coding Conventions

### File Naming
- Screens: PascalCase + location (e.g., `index.tsx`, `calendar.tsx`)
- Components: PascalCase (e.g., `TerrariumView.tsx`)
- Utilities: camelCase (e.g., `stressCalculator.ts`)
- Types: camelCase (e.g., `index.ts`)

### Component Structure
```typescript
// 1. Imports
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

// 2. Type definitions
interface Props {
  // ...
}

// 3. Component
export default function ComponentName({ props }: Props) {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleAction = () => {};

  // Render
  return <View />;
}

// 4. Styles
const styles = StyleSheet.create({});
```

### TypeScript
- Strict mode enabled
- Explicit types for function parameters
- Interface for component props
- Type for utility function returns

---

## 🎯 Next Steps for Code Quality

1. **Connect Real Data**: Replace mock data in Calendar and Stats
2. **Error Boundaries**: Add error handling at screen level
3. **Loading States**: Consistent loading UI across screens
4. **Accessibility**: Add ARIA labels and screen reader support
5. **Testing**: Unit tests for utilities, component tests
6. **Performance**: Memoization for expensive calculations
7. **Documentation**: JSDoc comments for complex functions

---

*Last Updated: 2025-12-03*
