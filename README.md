# Forum Nexus Hub 🌐

![Forum Nexus Hub Banner](https://i.postimg.cc/VLXDrHHF/forum-nexus-banner.png) 
A modern, full-stack forum application built with the MERN stack that enables users to engage in meaningful discussions through posted messages. This platform offers a comprehensive forum experience with user authentication, membership tiers, administrative controls, and real-time interactions.

## 🚀 Live Demo

**Frontend:** [Forum Nexus Hub Live](https://forum-nexus-hub.netlify.app/)  
**Admin Credentials:**
- Email: admin@forumnexus.com
- Password: Admin123

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Forum Nexus Hub is an interactive online platform designed to facilitate community discussions through organized posts and comments. The application features a robust membership system, administrative controls, and modern UI/UX design principles to create an engaging user experience.

### Purpose
To provide a scalable, secure, and user-friendly forum platform where communities can share knowledge, engage in discussions, and build meaningful connections through organized conversations.

## ✨ Key Features

### 🏠 Homepage & Navigation
- **Responsive Navigation Bar** with logo, search functionality, and user authentication
- **Dynamic Search System** with tag-based filtering and backend implementation
- **Post Sorting** by popularity (upvote/downvote ratio) and chronological order
- **Pagination** with 5 posts per page for optimal performance
- **Announcement System** with notification badges
- **Tag-based Filtering** for easy content discovery

### 👤 User Management
- **Dual Authentication System** (Email/Password + Social Login)
- **Role-based Access Control** (User/Admin)
- **Membership Tiers** with Bronze and Gold badges
- **User Dashboard** with profile management and post analytics
- **JWT Token Management** with secure authentication

### 📝 Post & Comment System
- **Rich Post Creation** with title, description, tags, and voting system
- **Interactive Voting** (upvote/downvote) with real-time updates
- **Nested Comment System** with reporting functionality
- **Social Sharing** integration using react-share
- **Post Visibility Controls** (Public/Private)
- **Comment Moderation** with admin oversight

### 💳 Membership & Payments
- **Stripe Integration** for secure payment processing
- **Membership Benefits** including unlimited posting for Gold members
- **Badge System** to recognize user contributions
- **Post Limit Management** (5 posts for free users, unlimited for Gold members)

### 🛡️ Administrative Features
- **Comprehensive Admin Dashboard** with analytics
- **User Management** with role assignment capabilities
- **Content Moderation** with reported content management
- **Announcement System** for community updates
- **Analytics Dashboard** with interactive charts using Recharts
- **Tag Management** system for consistent categorization

### 🔧 Advanced Features
- **Real-time Search** with popular search suggestions
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Form Validation** using React Hook Form
- **State Management** with TanStack Query for efficient data fetching
- **Interactive UI Components** with smooth animations using Framer Motion
- **Server-side Search** functionality
- **Axios Interceptors** for API management

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern UI library with latest features
- **Vite 7.0.4** - Fast build tool and development server
- **TailwindCSS 4.1.11** - Utility-first CSS framework
- **DaisyUI 5.0.46** - Component library for rapid UI development

### State Management & Data Fetching
- **TanStack Query 5.83.0** - Powerful data synchronization for React
- **Axios 1.10.0** - HTTP client with interceptors

### UI/UX Libraries
- **React Hook Form 7.60.0** - Performant forms with easy validation
- **React Select 5.10.2** - Flexible select input control
- **React Share 5.2.2** - Social media sharing components
- **React Icons 5.5.0** - Popular icon library
- **Framer Motion 12.23.6** - Production-ready motion library
- **Lottie React 2.4.1** - Render After Effects animations
- **React Tooltip 5.29.1** - Interactive tooltip components
- **Sonner 2.0.6** - Toast notification system

### Payment & Authentication
- **Stripe React 3.7.0** & **Stripe JS 7.6.1** - Secure payment processing
- **Firebase 11.10.0** - Authentication and hosting services

### Data Visualization
- **Recharts 3.1.0** - Composable charting library
- **PrimeReact 10.9.6** - Rich UI component suite
- **PrimeIcons 7.0.0** - Professional icon set

### Routing
- **React Router 7.6.3** - Declarative routing for React

### Development Tools
- **ESLint 9.30.1** - Code linting and formatting
- **TypeScript Support** - Type definitions for React

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database
- Firebase project setup
- Stripe account for payments

### Frontend Setup

1. **Clone the repository client side**
```bash
git clone https://github.com/yourusername/forum-nexus-hub-client.git
cd forum-nexus-hub-client
```
2. **Clone the repository server side**
```bash
git clone https://github.com/yourusername/forum-nexus-hub-client.git
cd forum-nexus-hub-client
```