# AutoFarmingBot - Crypto Farming Platform

## Overview

AutoFarmingBot is a Flask-based web application designed to manage cryptocurrency farming operations. The platform provides both user and admin interfaces for managing bot accounts across various networks like NodePay and Gradient, with comprehensive authentication, user management, and farming session tracking capabilities.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 with Flask
- **CSS Framework**: Tailwind CSS with custom dark theme
- **JavaScript**: Vanilla JavaScript for interactive features
- **UI Components**: Responsive design with mobile-first approach
- **Theme**: Dark mode with gradient accents using Inter font family

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Authentication**: Flask-Login for session management
- **Password Security**: Werkzeug for password hashing
- **Session Management**: Flask sessions with configurable secret key

### Database Schema
- **Users Table**: Stores user credentials, profile information, and role-based access
- **BotAccounts Table**: Manages farming bot accounts linked to users
- **FarmingSession Table**: Tracks farming activities and earnings (referenced but not fully implemented)

## Key Components

### Authentication System
- **User Registration/Login**: Email-based authentication with password hashing
- **Role-based Access Control**: Admin and user roles with different dashboard access
- **Session Management**: Persistent login with "remember me" functionality
- **Admin User Creation**: Automatic admin account creation on first run

### User Management
- **Profile Management**: First name, last name, username, and email
- **Account Status**: Active/inactive user management
- **Last Login Tracking**: User activity monitoring

### Bot Account Management
- **Multi-network Support**: Supports various farming networks (NodePay, Gradient, etc.)
- **Status Tracking**: Active, inactive, and error states for bot accounts
- **User Association**: Each bot account linked to a specific user

### Admin Interface
- **Dashboard**: Overview of platform statistics and user activity
- **User Management**: CRUD operations for user accounts
- **Bot Account Management**: Monitor and manage all bot accounts across users
- **Search and Filter**: Advanced search capabilities for users and accounts

### User Interface
- **Personal Dashboard**: User-specific view of their bot accounts and earnings
- **Account Management**: Add, edit, and monitor personal farming accounts
- **Earnings Tracking**: View total earnings and active account status

## Data Flow

1. **User Registration**: New users register with email/password → User record created → Redirect to user dashboard
2. **User Login**: Email/password validation → Session creation → Role-based dashboard redirect
3. **Bot Account Creation**: User adds farming account → BotAccount record created → Status tracking initiated
4. **Admin Operations**: Admin users can view/manage all users and bot accounts → Database updates → Real-time status updates

## External Dependencies

### Frontend Dependencies
- **Tailwind CSS**: CDN-based styling framework
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

### Backend Dependencies
- **Flask**: Core web framework
- **SQLAlchemy**: Database ORM
- **Flask-Login**: Authentication management
- **Werkzeug**: Security utilities and password hashing
- **ProxyFix**: WSGI middleware for deployment behind proxies

### Database
- **SQLite**: Default development database (fallback)
- **PostgreSQL**: Production database via DATABASE_URL environment variable
- **Connection Pooling**: Configured for production reliability

## Deployment Strategy

### Environment Configuration
- **Development**: SQLite database with debug mode enabled
- **Production**: PostgreSQL database with environment-based configuration
- **Session Security**: Configurable secret key via SESSION_SECRET environment variable

### Database Setup
- **Auto-migration**: Tables created automatically on application start
- **Admin Bootstrap**: Default admin user created if none exists
- **Connection Pooling**: Pre-ping and connection recycling for stability

### WSGI Configuration
- **ProxyFix**: Configured for deployment behind reverse proxies
- **Host Configuration**: Binds to 0.0.0.0:5000 for container compatibility

## Changelog
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.