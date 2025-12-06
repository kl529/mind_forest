# Mind Forest - Stress Management App 🌱

A React Native/Expo app that helps users manage stress through visual terrarium feedback and activity tracking.

## 🎯 Problem Definition

### Target Problem
Mind Forest addresses three critical challenges faced by stressed adults:

1. **Awareness Gap**: Users don't recognize how stressed they are or their current mental state
2. **Solution Gap**: Users are aware of their stress but don't know how to address it
3. **Action Gap**: Users know what to do but struggle to consistently practice stress relief

### Target Users

**Primary Target**: Stressed adults in their 20s
- People who haven't yet developed effective stress management techniques
- Recently started working, facing workplace and interpersonal stress
- Experiencing mild fatigue and psychosomatic symptoms
- Recognize "I'm having a hard time" but don't know what to do next

**Secondary Target**: Late 20s - Mid 30s adults still developing stress management skills

**Persona**: A, mid-20s professional
- Recently started working
- Stress accumulating from work and relationships
- Experiencing mild helplessness and physical symptoms
- Thinks "things are tough lately" but unsure how to cope

### Current Market Landscape
- **Alternative Apps**: Limited adoption of stress management apps in Korea
- **Professional Help**: Psychological counseling not widely accessible or normalized
- **Gap**: Need for an approachable, non-clinical tool for daily stress management

## Features

### 🏠 Main Screen (Home Tab)
- **Terrarium Visualization**: Dynamic terrarium that changes based on your stress levels
- **Stress Notifications**: Contextual stress management tips based on current levels
- **Quick Entry**: + button opens input modal for logging activities

### 📅 Calendar Screen 
- **Monthly View**: Navigate through months with left/right arrows
- **Color-coded Days**: Visual stress level indicators
  - **Blue tones** (3 levels): Good stress days - lighter to darker blue
  - **Red tones** (3 levels): High stress days - lighter to darker red
- **Daily Stress Tracking**: See patterns in your stress levels over time

### 📊 Statistics Screen
- **Monthly Trends**: Line graphs showing stress levels and stress relief activities
- **Historical Comparison**: Previous month data shown in lighter colors
- **Visual Analytics**: Track your progress over time

### ➕ Input Screen (Bottom Sheet)
- **Activity Selection**: Choose from stress or stress-relief categories
  - Walking, Sleep issues, Reading, etc.
- **Intensity Scale**: 1-5 intensity slider
- **Notes**: Free-form text for additional context
- **Save/Cancel**: Persist or discard entries

## Tech Stack
- **Framework**: Expo/React Native
- **Language**: TypeScript
- **Navigation**: Expo Router + React Navigation
- **Styling**: React Native StyleSheet with theming
- **Platform**: iOS, Android, Web

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Run on platforms:
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator  
   npm run web     # Web browser
   ```

## Code Quality
- Run linting: `npm run lint`
- TypeScript strict mode enabled
- Component-based architecture with theming support

## Project Structure
```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen
│   ├── calendar.tsx  # Calendar screen
│   └── stats.tsx     # Statistics screen
├── _layout.tsx       # Root layout
└── +not-found.tsx    # 404 page

components/           # Reusable components
├── ui/              # Platform-specific UI components
├── TerrariumView.tsx # Main terrarium visualization
├── InputModal.tsx    # Activity input modal
└── StressIndicator.tsx # Visual stress indicators

types/               # TypeScript type definitions
└── index.ts         # App-wide type definitions
```

## App Flow
1. **Launch** → Home screen with terrarium
2. **Log Activity** → Tap + button → Fill input form → Save
3. **View History** → Calendar tab → See color-coded stress days
4. **Analyze Trends** → Statistics tab → View monthly progress

---
Built with ❤️ using Expo and React Native