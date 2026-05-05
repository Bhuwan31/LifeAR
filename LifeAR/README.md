# LifeAR

AR-guided emergency first response assistant with full authentication, user profiles, and offline-first architecture.

---

## Overview

LifeAR is a React Native + Expo mobile application designed for emergency preparedness. It provides AR-guided first aid instructions, panic mode with auto-dial, multi-language emergency phrases, and gamified CPR training — all working offline with local authentication.

---

## Features

- **Panic Mode**: 3-second countdown, auto-dial emergency services (119), step-by-step protocols, compression counter with metronome
- **AR Guide**: Camera overlays with visual guides for CPR, choking, bleeding, and burns
- **Emergency Phrases**: Text-to-speech in 6 languages (English, Korean, Nepali, Chinese, Japanese, Vietnamese)
- **Training Mode**: 4 difficulty levels, BPM scoring, streak system, progress tracking
- **Full Authentication**: Phone/email login, registration, password reset, profile management
- **Offline-First**: All data stored locally via AsyncStorage, no backend required

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 51 |
| Navigation | React Navigation v6 (Stack) |
| State Management | React Context + useReducer |
| Storage | AsyncStorage (local) |
| Camera | expo-camera |
| Image Picker | expo-image-picker |
| Speech | expo-speech (TTS) |
| Haptics | expo-haptics |
| Sensors | expo-sensors |
| Audio | expo-av |
| Animations | React Native Animated + Reanimated |

---

## Project Structure

```
LifeAR/
├── App.js                          # Root app with auth navigation
├── app.json                        # Expo configuration + permissions
├── package.json                    # Dependencies
├── babel.config.js                 # Babel + Reanimated
├── .gitignore                      # Git ignore rules
├── assets/                         # Images, icons, audio, overlays
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── overlays/
│   └── audio/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js          # Sign in with phone/email
│   │   ├── RegisterScreen.js       # Create account (phone required, email optional)
│   │   ├── ForgotPasswordScreen.js # Reset password flow
│   │   ├── HomeScreen.js           # Dashboard with profile button
│   │   ├── ProfileScreen.js        # View profile + logout
│   │   ├── EditProfileScreen.js    # Edit profile + photo upload
│   │   ├── PanicModeScreen.js      # Emergency activation + countdown
│   │   ├── ARGuideScreen.js        # Camera + AR overlays for first aid
│   │   ├── EmergencyPhrasesScreen.js # 6-language TTS phrases
│   │   ├── EmergencyTypeScreen.js  # 12 emergency scenarios
│   │   └── TrainingModeScreen.js   # Gamified CPR practice
│   ├── components/                 # Reusable UI components
│   ├── hooks/                      # Custom React hooks
│   ├── utils/
│   │   └── validation.js           # Form validation helpers
│   ├── data/
│   │   └── emergencyData.js        # Emergency protocols data
│   └── context/
│       └── AuthContext.js          # Authentication state management
└── docs/                           # Documentation
```

---

## Quick Start

### Prerequisites

- Windows 10/11 (64-bit), macOS, or Linux
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/LifeAR.git
cd LifeAR

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

---

## Windows Setup (Detailed)

If you encounter issues on Windows, follow this full setup guide:

### Step 1: Install Node.js

Download the LTS version from https://nodejs.org. During installation, check "Automatically install necessary tools".

Verify installation:

```powershell
node --version    # v18+ or v20+
npm --version     # 9+
```

### Step 2: Install Expo CLI

```powershell
npm install -g expo-cli
expo --version
```

### Step 3: Create Project

```powershell
mkdir C:\Projects
cd C:\Projects

# If you have the project files, extract them here
# Otherwise, create a new Expo project:
npx create-expo-app LifeAR --template blank
```

### Step 4: Install Dependencies

```powershell
cd C:\Projects\LifeAR

npm install expo@~51.0.0
npm install react@18.2.0 react-native@0.74.5
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-screens react-native-safe-area-context
npm install @react-native-community/masked-view
npm install expo-camera expo-av expo-sensors expo-speech expo-haptics
npm install expo-image-picker expo-linear-gradient
npm install @react-native-async-storage/async-storage
npm install lottie-react-native react-native-svg
npm install react-native-reanimated
```

If `npm install` fails:

```powershell
npm install --legacy-peer-deps
```

### Step 5: Add Assets

Create an `assets/` folder with these images (or use placeholders):
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/favicon.png` (48x48)

Create subdirectories:

```powershell
mkdir assets\overlays
mkdir assets\audio
```

### Step 6: Start Development Server

```powershell
npx expo start
```

### Windows Troubleshooting

| Issue | Solution |
|-------|----------|
| `expo` command not found | Run `npm install -g expo-cli` again |
| Port 8081 already in use | Run `npx expo start --port 8082` |
| Metro bundler fails | Delete `node_modules` and `package-lock.json`, then `npm install` |
| Camera not working on Android | Grant camera permission in phone settings |
| Image picker crashes | Ensure `expo-image-picker` is installed and configured in `app.json` |
| Build fails with Babel error | Check `babel.config.js` includes `react-native-reanimated/plugin` |

---

## Environment Setup (Windows)

Set system environment variables for Android development:

1. Press Windows key, search: "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables"
4. Add new system variable:
   - Name: `ANDROID_HOME`
   - Value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
5. Edit `Path` variable, add: `%ANDROID_HOME%\platform-tools`

---

## Authentication

This app uses local authentication (no backend server). All user data is stored in AsyncStorage.

### First-Time Setup

1. Open the app, tap "Sign Up"
2. Enter: Full Name (required), Phone (required), Password, Blood Type, Emergency Contact
3. Email is optional
4. Submit — you will be automatically logged in

### Subsequent Logins

Use your registered phone number and password.

---

## Design System

| Token | Value |
|-------|-------|
| Primary Red | `#DC2626` |
| Success Green | `#10B981` |
| Warning Amber | `#F59E0B` |
| Background | `#0a0a0a` |
| Surface | `#1a1a1a` |
| Border | `#2a2a2a` |
| Text Primary | `#ffffff` |
| Text Secondary | `#888888` |
| Text Tertiary | `#666666` |

---

## Screens

| Screen | Features |
|--------|----------|
| Login | Phone/email auth, error handling, navigation to register/forgot |
| Register | Full form validation, optional email, emergency info collection |
| Forgot Password | 2-step reset flow with validation |
| Home | Greeting by time, Panic Mode button, 12 emergency grid, profile access |
| Panic Mode | 3-sec countdown, auto-dial 119, step protocol, compression counter, metronome |
| AR Guide | Camera overlay, step-by-step instructions, TTS, visual guides |
| Emergency Phrases | 6 languages, TTS pronunciation |
| Training Mode | 4 difficulty levels, BPM scoring, streak system, progress tracking |
| Profile | View all info, emergency details, sign out |
| Edit Profile | Update all fields, photo upload (camera/gallery) |

---

## Building for Production

### Android APK

```bash
npx expo prebuild
npx expo run:android
```

### iOS (Mac only)

```bash
npx expo prebuild
npx expo run:ios
```

### EAS Build (Cloud)

```bash
npm install -g eas-cli
eas build --platform android
```

---

## Notes

- **No backend required** — All auth and data is local (AsyncStorage)
- **To add a real backend** — Replace AsyncStorage calls in `AuthContext.js` with API calls to your server
- **Profile photos** — Stored as local file URIs (not uploaded to cloud)
- **Emergency numbers** — Currently set to Korea (119). Change in `src/data/emergencyData.js`
- **Offline capable** — Works without internet except for initial app load

---

## Contest Checklist

- [x] Panic Mode with countdown and auto-dial
- [x] AR camera overlays for CPR/Choking/Bleeding/Burns
- [x] Multi-language emergency phrases with TTS
- [x] Gamified training mode with scoring
- [x] Full authentication (login/register/forgot)
- [x] Editable user profile with photo upload
- [x] Emergency contact and blood type in profile
- [x] Dark theme optimized for emergency use
- [x] Haptic feedback throughout
- [x] Works offline

---

## License

MIT

---

Built for emergency preparedness.
