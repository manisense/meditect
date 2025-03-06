# Meditect

A medicine scanner application built with Expo, TypeScript, Supabase and TensorFlow Lite.

## Features

- Scan medicine bottles, strips, or tablets using your camera
- Detect medicine name, expiry date and other details automatically
- Store and access your medicine history
- User-friendly interface designed for accessibility
- Secure authentication and data storage

## Technology Stack

- React Native with Expo
- TypeScript for type safety
- Supabase for backend and authentication
- TensorFlow Lite for machine learning and image recognition

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/meditect.git
cd meditect
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server
```bash
expo start
```

## Project Structure

- `/assets` - Images and other static assets
- `/components` - Reusable UI components
- `/screens` - Screen components
- `/navigation` - Navigation configuration
- `/hooks` - Custom hooks
- `/services` - API and other services
- `/utils` - Utility functions
- `/types` - TypeScript type definitions