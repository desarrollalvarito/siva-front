---
description: Repository Information Overview
alwaysApply: true
---

# SIVA Frontend Information

## Summary
SIVA (Sistema de Ventas y Administración Comercial) is a sales and commercial administration system built with Nuxt 3 and Vue 3. The application provides functionality for managing clients, employees, products, orders, and sales with a modern UI built on Vuetify.

## Structure
- **assets/**: Contains images, styles, and SCSS variables
- **components/**: Vue components organized by domain (client, employee, order, product, production)
- **composables/**: Vue composables for data fetching and state management
- **layouts/**: Page layouts including default and blank templates
- **pages/**: Vue pages representing different routes in the application
- **plugins/**: Vuetify, Iconify, and API plugins
- **public/**: Static assets like favicon
- **server/**: Server-side code and plugins
- **stores/**: Pinia stores for state management
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and helpers
- **views/**: Additional view components organized by section

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.7.2
**Framework**: Nuxt 3.14.1592, Vue 3
**UI Framework**: Vuetify 3.7.5
**Build System**: Vite 5.4.11
**Package Manager**: npm/pnpm

## Dependencies
**Main Dependencies**:
- Nuxt 3.14.1592 (Vue.js framework)
- Vuetify 3.7.5 (Material Design component framework)
- Pinia 2.3.0 (State management)
- @sidebase/nuxt-auth 0.10.1 (Authentication)
- vue3-apexcharts 1.5.2 (Charts)
- @vueuse/core 10.11.1 (Composition utilities)

**Development Dependencies**:
- TypeScript 5.7.2
- ESLint 8.57.1
- Sass 1.76.0
- Stylelint 16.8.0
- Vite 5.4.11
- @iconify packages for icons

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Build icons
npm run build:icons
```

## Authentication
**Provider**: Local authentication
**Endpoints**:
- Login: POST /login
- Logout: POST /logout
- Session: GET /session
- Refresh: POST /refresh
**Token Management**: JWT with refresh token support
**Session Duration**: Access token (15 min), Refresh token (12 hours)

## API Integration
**Base URL**: Configured via NUXT_PUBLIC_API_BASE_URL environment variable
**Proxy Configuration**: Routes /siva/* are proxied to the API
**Authentication Origin**: Configured via NUXT_AUTH_ORIGIN environment variable

## Environment Configuration
**Required Variables**:
- NUXT_AUTH_ORIGIN: Authentication API endpoint
- AUTH_SECRET: Secret for authentication
- NUXT_PUBLIC_API_BASE_URL: Base URL for API requests
- NUXT_APP_BASE_URL: Base URL for the application
- VITE_MAPBOX_ACCESS_TOKEN: Mapbox access token (if using maps)

## Main Components
**Client Management**:
- Client listing and CRUD operations
- Client modal for adding/editing clients

**Employee Management**:
- Employee listing and CRUD operations
- Employee modal for adding/editing employees

**Product Management**:
- Product listing and CRUD operations
- Product modal for adding/editing products

**Order Management**:
- Order listing and CRUD operations
- Order modal for adding/editing orders

**Production Management**:
- Production tracking
- Production reports

## Project Structure Patterns
- Domain-driven component organization
- Composable functions for API interactions
- Type definitions for models and API responses
- Vuetify for UI components and theming
- Authentication with token-based approach
