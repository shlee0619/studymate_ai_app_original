<div align="center"># StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /># StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
</div># StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# Run and deploy your AI Studio app# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
This contains everything you need to run your app locally.# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
View your app in AI Studio: https://ai.studio/apps/drive/15UjRk_ZoJU3fU-op2-5-L8ez_JMXZ2ip# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
## Run Locally# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
**Prerequisites:**  Node.js# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
1. Install dependencies:# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
   `npm install`# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
3. Run the app:# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
   `npm run dev`# StudyMate AI

An intelligent learning application that provides personalized study experiences using AI.

## Recent Fixes Applied

### âœ… Critical Issues Fixed

1. **Missing TypeScript Dependencies**: Added `@types/react` and `@types/react-dom` to `package.json`
2. **Runtime Error Handling**: Added IndexedDB fallback and better error handling for unsupported browsers
3. **Security Fix**: Removed `dangerouslySetInnerHTML` to prevent XSS vulnerabilities
4. **Internationalization**: Replaced hardcoded Korean text with constants for better maintainability
5. **Environment Configuration**: Created `.env.local` template for API configuration

### ðŸ”§ Improvements Made

- **Enhanced Error Handling**: Added graceful fallbacks when IndexedDB is not available (e.g., private browsing)
- **Type Safety**: Improved TypeScript type checking and validation
- **Code Security**: Implemented safe HTML rendering for evidence text
- **Better UX**: More user-friendly error messages and loading states

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local.production
   ```
   - Edit `.env.local.production` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Dashboard**: Track learning progress and set study goals
- **Library**: Upload and manage study materials  
- **Quiz System**: AI-powered quiz generation with spaced repetition
- **Review**: Smart review system using SM-2 algorithm
- **Error Analysis**: Track and categorize mistakes for better learning
- **Concepts**: Organize knowledge by concepts and prerequisites
- **Settings**: Customize API endpoints and preferences

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data persistence
- **AI Integration**: Gemini API for intelligent features

## Browser Compatibility

The app now includes fallbacks for:
- Browsers without IndexedDB support
- Private browsing modes where IndexedDB might be disabled
- Older browsers with limited modern JavaScript support

## Security Features

- Safe HTML rendering to prevent XSS attacks
- Secure API key handling via environment variables
- Input validation and sanitization

## Contributing

When contributing to this project, please:
1. Follow TypeScript best practices
2. Add proper error handling for new features
3. Test in both normal and private browsing modes
4. Use the message constants instead of hardcoded text

## Troubleshooting

### Common Issues

1. **"Database not available" warnings**: This is expected in private browsing mode or unsupported browsers. The app will continue to work with limited functionality.

2. **API errors**: Make sure your `GEMINI_API_KEY` is properly set in the `.env.local` file.

3. **Build errors**: Ensure all dependencies are installed with `npm install`.

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment configuration
3. Try clearing browser storage and refreshing
## Quality Checks

- `npm run lint` : ESLint ±â¹Ý Á¤Àû ºÐ¼® ¼öÇà
- `npm run lint:fix` : ÀÚµ¿ ¼öÁ¤ °¡´ÉÇÑ ¸°Æ® ÀÌ½´ Á¤¸®
- `npm run format` / `npm run format:check` : Prettier Æ÷¸Ë ÀÏ°ý Àû¿ë ¹× °ËÁõ
- `npm run test` : Vitest·Î ´ÜÀ§/ÄÄÆ÷³ÍÆ® Å×½ºÆ® ÀÏ°ý ½ÇÇà
- `npm run test:watch` : °³¹ß Áß ºü¸¥ ÇÇµå¹éÀ» À§ÇÑ ¿öÄ¡ ¸ðµå Å×½ºÆ®
- `npm run test:coverage` : V8 Ä¿¹ö¸®Áö ¸®Æ÷Æ® »ý¼º
