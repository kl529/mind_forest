# Code Style and Conventions

## TypeScript Configuration
- **Strict mode enabled** (`"strict": true`)
- **Path aliases**: `@/*` points to project root
- **File extensions**: `.ts` and `.tsx`

## Code Conventions
- **Component naming**: PascalCase (e.g., `RootLayout`, `ThemedText`)
- **File naming**: 
  - Components: PascalCase.tsx (e.g., `ThemedView.tsx`)
  - Layouts: `_layout.tsx`
  - Special files: `+not-found.tsx`
- **Export pattern**: Default exports for main components
- **Imports**: ES6 imports with relative paths using `../`

## Project Structure Patterns
- **File-based routing**: Files in `app/` directory create routes
- **Tabs layout**: `(tabs)/` directory for tab navigation
- **Components**: Reusable components in `/components` directory
- **Themed components**: `ThemedText`, `ThemedView` for consistent styling
- **UI components**: Platform-specific UI components in `/components/ui/`
- **Hooks**: Custom hooks in `/hooks` directory
- **Constants**: Color schemes and constants in `/constants`

## Styling Approach
- **Theme support**: Dark and light themes using `ThemeProvider`
- **Color scheme**: Automatic dark/light mode detection via `useColorScheme`
- **Themed components**: Consistent theming throughout the app