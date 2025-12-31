# KOMPL.AI - Frontend Requirements Document

## Architecture Overview

KOMPL.AI frontend is built using Next.js 14+ with TypeScript, following a dual architecture approach for both Client Frontend (tenant-specific) and Platform Owner Frontend (admin/management). The architecture emphasizes component reusability, state management, and seamless integration with backend services.

### Core Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript strict mode
- **Styling**: Tailwind CSS with custom design tokens
- **Component Library**: shadcn/ui with custom extensions
- **State Management**: React Query + Zustand
- **API Integration**: REST API with automatic caching
- **Authentication**: JWT-based authentication with token refresh

### Architecture Diagram
```
Client FrontEnd (Next.js) → Multi-Tenant Based
Platform Owner FrontEnd (Next.js) → Tenant Management
Shared Components → Reusable UI Components
State Management → React Query + Zustand
API Integration → Backend API Services
```

## Client Frontend (Tenant-Specific)

### Core Architecture

#### Project Structure
```
client-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (tenant)/           # Tenant-specific routes
│   │   ├── regops/         # RegOps module
│   │   ├── privacyops/     # PrivacyOps module  
│   │   ├── riskops/        # RiskOps module
│   │   └── auditops/       # AuditOps module
│   ├── components/         # Reusable components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── components/             # Shared components
├── hooks/                 # Custom hooks
├── lib/                   # Utility libraries
└── styles/                # Global styles and theming
```

#### State Management Strategy
- **React Query**: For API data fetching and caching
- **Zustand**: For local state management
- **Context API**: For theme and authentication state
- **LocalStorage**: For user preferences and offline data

### Routing & Navigation

#### Client-Side Routing
- **Dynamic Routes**: Tenant-specific routing
- **Role-Based Navigation**: Different navigation for different user roles
- **Breadcrumb Navigation**: Hierarchical navigation trails
- **Route Guards**: Authentication and authorization guards

#### Navigation Structure
```
Dashboard → Domain Selection → Module Navigation → Feature Pages
```

### Component Library

#### Design System Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Inputs**: Text, select, textarea, checkbox, radio
- **Forms**: Form validation and submission handling
- **Tables**: Data tables with sorting, filtering, pagination
- **Cards**: Info, warning, success, error cards
- **Modals**: Dialog modals for user interactions
- **Tabs**: Tab navigation for multi-step workflows
- **Progress Indicators**: Loading states and progress bars

#### Reusable Components
- **Data Display Components**: Charts, tables, lists
- **Form Components**: Standardized form elements
- **Feedback Components**: Toast notifications, alerts
- **Layout Components**: Page layouts and containers

### API Integration

#### React Query Configuration
```typescript
// lib/react-query/client.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### API Service Layer
```typescript
// lib/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Performance Requirements

#### Code Splitting
- **Dynamic Imports**: Lazy loading of heavy components
- **Route-based Splitting**: Code splitting per route
- **Component-level Splitting**: Splitting large components

#### Image Optimization
- **Next.js Image Component**: Automatic image optimization
- **Lazy Loading**: Images load on viewport entry
- **Placeholder**: Blur-up placeholders for better UX

#### Bundle Size Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Reduce initial load time
- **Compression**: Gzip/Brotli compression

## Platform Owner Frontend

### Core Architecture

#### Project Structure
```
platform-owner-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── dashboard/          # Platform dashboard
│   ├── tenants/            # Tenant management
│   ├── settings/           # System settings
│   ├── ai-models/          # AI model configuration
│   └── monitoring/         # System monitoring
├── components/             # Admin-specific components
├── hooks/                 # Admin-specific hooks
├── lib/                   # Admin-specific utilities
└── styles/                # Admin-specific styles
```

### Key Modules

#### Super Admin Dashboard
- **Platform Overview**: System-wide monitoring and management
- **Tenant Management**: All tenant overview and control
- **User Management**: All user accounts and roles
- **System Settings**: Global system configurations
- **Audit Trail**: Comprehensive system audit logging
- **Alert Management**: System-wide alert configuration
- **Performance Monitoring**: Platform performance metrics
- **Compliance Dashboard**: Cross-tenant compliance overview

#### Tenant Dashboard
- **Tenant Overview**: Tenant-specific performance monitoring
- **Domain Performance**: RegOps, PrivacyOps, RiskOps, AuditOps metrics
- **User Activity**: Tenant user activity tracking
- **Compliance Status**: Tenant compliance health
- **Risk Overview**: Tenant risk exposure
- **Audit Status**: Tenant audit findings
- **Customizable Widgets**: Drag-and-drop dashboard customization

#### Tenant & License Management
- **Tenant Onboarding**: New tenant creation workflow
- **License Management**: Subscription and usage tracking
- **User Management**: User accounts and roles
- **Tenant Settings**: Tenant-specific configurations

#### AI Model & Policy Configuration
- **Model Selection**: Choose AI models for different tasks
- **Policy Management**: Policy creation and management
- **Model Tuning**: AI model parameter tuning
- **Performance Monitoring**: AI model performance tracking

#### Usage & Billing
- **Usage Dashboard**: API usage and consumption tracking
- **Billing Management**: Invoice generation and payment
- **Cost Optimization**: AI service cost optimization
- **Reporting**: Usage and billing reports

#### Monitoring & Audit
- **System Dashboard**: Platform health monitoring
- **Audit Trail**: Comprehensive audit logging
- **Alert Management**: Alert configuration and monitoring
- **Performance Metrics**: System performance tracking

### Admin Features

#### User Management
- **User Creation**: Create and manage user accounts
- **Role Assignment**: Assign roles and permissions
- **Group Management**: User group creation and management
- **Access Control**: Fine-grained access control

#### System Settings
- **Global Configuration**: System-wide settings
- **Theme Customization**: Branding and theme customization
- **Integration Settings**: External system integrations
- **Security Settings**: Security and compliance settings

#### Audit Trail Review
- **Activity Logging**: Review user activities and actions
- **System Events**: Review system events and errors
- **Compliance Audits**: Review compliance-related activities
- **Export Capabilities**: Export audit logs and reports

## Component Design System

### Design Tokens

#### Color Palette
```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary: #10b981;
  --secondary-hover: #059669;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --warning: #f59e0b;
  --warning-hover: #d97706;
  --info: #3b82f6;
  --info-hover: #2563eb;
  --success: #10b981;
  --success-hover: #059669;
  --background: #ffffff;
  --surface: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border: #e5e7eb;
  --shadow: #0000000d;
}
```

#### Typography
```css
:root {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;
  --text-8xl: 6rem;
  --text-9xl: 7.5rem;
}
```

### Component Categories

#### Layout Components
- **PageLayout**: Standard page layout with header, sidebar, content
- **DashboardLayout**: Dashboard-specific layout
- **FormLayout**: Form layout with validation
- **ModalLayout**: Modal dialog layout

#### Form Components
- **TextInput**: Text input with validation
- **SelectInput**: Dropdown select input
- **CheckboxInput**: Checkbox input
- **RadioInput**: Radio button input
- **DatePicker**: Date picker input
- **FileInput**: File upload input

#### Data Display Components
- **DataTable**: Data table with sorting and filtering
- **Chart**: Data visualization charts
- **Card**: Information card display
- **List**: List item display
- **Badge**: Status and category badges

#### Navigation Components
- **Sidebar**: Main navigation sidebar
- **TopNav**: Top navigation bar
- **Breadcrumb**: Breadcrumb navigation
- **TabNav**: Tab navigation component

#### Feedback Components
- **Toast**: Toast notification
- **Alert**: Alert message
- **Loading**: Loading spinner and progress
- **ErrorBoundary**: Error boundary component

## State Management

### React Query Configuration
```typescript
// lib/react-query/client.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Zustand Store Examples
```typescript
// stores/auth-store.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      set({ user: response.data.user, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },
  refreshToken: async () => {
    const token = get().token;
    if (token) {
      try {
        const response = await api.post('/auth/refresh', { token });
        set({ token: response.data.token });
      } catch (error) {
        get().logout();
      }
    }
  },
}));
```

### Context API for Theming
```typescript
// contexts/theme-context.tsx
import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## Responsive Design

### Breakpoint Configuration
```css
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Responsive Component Examples
```typescript
// components/responsive/ResponsiveLayout.tsx
import { useMediaQuery } from 'react-responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <div className={`
      ${isMobile ? 'mobile-layout' : ''}
      ${isTablet ? 'tablet-layout' : ''}
      ${isDesktop ? 'desktop-layout' : ''}
    `}>
      {children}
    </div>
  );
}
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and landmarks
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper HTML5 semantic elements

### Assistive Technology Support
- **Screen Readers**: NVDA, JAWS, VoiceOver support
- **Magnifiers**: Zoom and magnification support
- **Speech Input**: Voice command support
- **Alternative Input**: Switch control support

## Testing Strategy

### Unit Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **Testing Coverage**: 80%+ test coverage target

### Integration Testing
- **Cypress**: End-to-end testing
- **Playwright**: Browser automation
- **API Testing**: REST API integration testing

### Accessibility Testing
- **axe-core**: Automated accessibility testing
- **Manual Testing**: Manual accessibility validation
- **User Testing**: User testing with assistive technologies

## Performance Optimization

### Loading States
- **Skeleton Screens**: Placeholder loading states
- **Progress Indicators**: Loading progress bars
- **Lazy Loading**: Component and image lazy loading

### Caching Strategy
- **React Query**: API response caching
- **LocalStorage**: Client-side data caching
- **Service Workers**: Offline caching capabilities

### Bundle Optimization
- **Code Splitting**: Dynamic imports and route-based splitting
- **Tree Shaking**: Remove unused code
- **Compression**: Gzip and Brotli compression

## Appendix

### Technology Stack Details
- **Next.js Version**: 14+
- **TypeScript Version**: 5+
- **Tailwind CSS Version**: 3+
- **shadcn/ui Version**: Latest stable
- **React Query Version**: Latest stable
- **Zustand Version**: Latest stable

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Vite**: Build tool (optional)

### Deployment Configuration
- **Vercel**: Primary deployment platform
- **Environment Variables**: Secure environment configuration
- **CI/CD**: Continuous integration and deployment