# Overview

This is a full-stack web application built with React and Express, designed as a dashboard system for managing cards, incidents, and inventory. The application uses a PostgreSQL database with Drizzle ORM for data management and features a modern UI built with shadcn/ui components and Tailwind CSS. The system provides CRUD operations, data visualization with charts, filtering capabilities, and export functionality for business operations management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and Peibo brand colors
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with structured error handling and logging
- **Validation**: Zod schemas for runtime type validation
- **Development**: Hot module replacement and runtime error overlays

## Data Layer
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schemas between frontend and backend
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL driver

## Project Structure
- **Monorepo**: Single repository with client, server, and shared code
- **Shared Types**: Common TypeScript interfaces and Zod schemas
- **Component Organization**: UI components separated by functionality
- **Asset Management**: Centralized asset handling with proper aliasing

## Development Experience
- **Hot Reloading**: Vite middleware integrated with Express in development
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Code Quality**: Consistent formatting and linting setup
- **Path Aliases**: Simplified imports with @ aliases for cleaner code

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

## UI and Design
- **Radix UI**: Accessible component primitives for forms and interactions
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library for UI elements
- **Google Fonts**: Inter font family for typography

## Data and Charts
- **TanStack Query**: Server state management and caching
- **Recharts**: Chart library for data visualization and analytics
- **date-fns**: Date manipulation and formatting utilities

## Development Tools
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Static type checking and improved developer experience
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Replit Integration**: Development environment optimizations for Replit platform

## Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod