# 🚨 LifeAR - Complete Project

> **AR-guided emergency first response assistant with full authentication, user profiles, and offline-first architecture.**

---
You don’t set environment variables in Visual Studio Code or inside Android Studio — you set them in Windows itself.

Do this:
Press Windows key → search: Environment Variables
Click “Edit the system environment variables”
Click Environment Variables
Add these:
1. New system variable:
Name:
ANDROID_HOME
Value:
C:\Users\praja\AppData\Local\Android\Sdk
path
%ANDROID_HOME%\platform-tools

firebase package name
com.lifear.app
## 📁 Project Structure

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

## 🚀 Full Windows Setup Guide (From Scratch)

### Prerequisites

1. **Windows 10/11** (64-bit)
2. **Node.js 18+** — Download from [nodejs.org](https://nodejs.org)
3. **Git** — Download from [git-scm.com](https://git-scm.com)
4. **Expo Go app** on your phone (iOS/Android) — Search "Expo Go" in App Store/Play Store

### Step 1: Install Node.js

```powershell
# Download and run the Windows installer from nodejs.org
# Choose "LTS" version (e.g., v20.x.x)
# During install, CHECK "Automatically install necessary tools"

# Verify installation
node --version    # Should show v18+ or v20+
npm --version     # Should show 9+
```

### Step 2: Install Expo CLI

```powershell
# Open PowerShell or Command Prompt as Administrator
npm install -g expo-cli

# Verify
expo --version
```

### Step 3: Create Project Directory

```powershell
# Create a folder for your project
mkdir C:\Projects
cd C:\Projects

# If you have the project files, extract them here
# Otherwise, create a new Expo project:
npx create-expo-app LifeAR --template blank
```

### Step 4: Install Dependencies

```powershell
cd C:\Projects\LifeAR

# Install all required packages
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

> **Tip:** If `npm install` fails, try:
> ```powershell
> npm install --legacy-peer-deps
> ```

### Step 5: Copy Project Files

Replace the default files with the LifeAR project files:

1. Replace `App.js` with the provided `App.js`
2. Replace `app.json` with the provided `app.json`
3. Replace `babel.config.js` with the provided `babel.config.js`
4. Create `src/screens/` folder and add all screen files
5. Create `src/context/` folder and add `AuthContext.js`
6. Create `src/utils/` folder and add `validation.js`
7. Create `src/data/` folder and add `emergencyData.js`

### Step 6: Add Assets

Create an `assets/` folder and add these placeholder images (or use any images):

```powershell
# Create directories
mkdir assets\overlays
mkdir assets\audio

# You can use any PNG images as placeholders for:
# - assets/icon.png (1024x1024)
# - assets/splash.png (1242x2436)
# - assets/adaptive-icon.png (1024x1024)
# - assets/favicon.png (48x48)
```

> For demo purposes, you can create simple colored squares using Paint or any image editor.

### Step 7: Start the Development Server

```powershell
cd C:\Projects\LifeAR
npx expo start
```

You'll see a QR code in the terminal. **Scan it with Expo Go app** on your phone.

> **For Android emulator:** Press `a` in the terminal  
> **For iOS simulator:** Press `i` in the terminal (Mac only)

### Step 8: Common Windows Issues & Fixes

| Issue | Solution |
|-------|----------|
| `expo` command not found | Run `npm install -g expo-cli` again |
| Port 8081 already in use | Run `npx expo start --port 8082` |
| Metro bundler fails | Delete `node_modules` and `package-lock.json`, then `npm install` |
| Camera not working on Android | Grant camera permission in phone settings |
| Image picker crashes | Make sure `expo-image-picker` is installed and configured in `app.json` |
| Build fails with Babel error | Check `babel.config.js` has `react-native-reanimated/plugin` |

### Step 9: Build for Production (Optional)

```powershell
# For Android APK
npx expo prebuild
npx expo run:android

# For iOS (Mac only)
npx expo prebuild
npx expo run:ios

# Or use EAS Build (cloud build)
npm install -g eas-cli
eas build --platform android
```

---

## 🔐 Authentication Features

| Feature | Description |
|---------|-------------|
| **Login** | Phone number or email + password |
| **Register** | Full name (required), phone (required), email (optional), password, blood type, emergency contact |
| **Forgot Password** | Enter phone/email → reset to new password |
| **Profile View** | View all user info, emergency details, logout |
| **Edit Profile** | Update all fields + upload profile photo (camera or gallery) |
| **Offline-first** | All user data stored locally via AsyncStorage |

### Demo Login (After Registration)

Since this is a local auth system (no backend), you must **register first**:

1. Open app → Tap "Sign Up"
2. Fill: Full Name, Phone, Password (email optional)
3. Submit → Auto-logs you in
4. Next time: Use phone + password to login

---

## 🎨 Design System

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

## 🛠️ Tech Stack

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

## 📱 Features Summary

| Screen | Features |
|--------|----------|
| **Login** | Phone/email auth, error handling, navigation to register/forgot |
| **Register** | Full form validation, optional email, emergency info collection |
| **Forgot Password** | 2-step reset flow with validation |
| **Home** | Greeting by time, Panic Mode button, 12 emergency grid, profile access |
| **Panic Mode** | 3-sec countdown, auto-dial 119, step protocol, compression counter, metronome |
| **AR Guide** | Camera overlay, step-by-step instructions, TTS, visual guides |
| **Emergency Phrases** | 6 languages (EN/KO/NE/ZH/JA/VI), TTS pronunciation |
| **Training Mode** | 4 difficulty levels, BPM scoring, streak system, progress tracking |
| **Profile** | View all info, emergency details, sign out |
| **Edit Profile** | Update all fields, photo upload (camera/gallery) |

---

## 📝 Notes

- **No backend required** — All auth and data is local (AsyncStorage)
- **To add a real backend** — Replace AsyncStorage calls in `AuthContext.js` with API calls to your server
- **Profile photos** — Stored as local file URIs (not uploaded to cloud)
- **Emergency numbers** — Currently set to Korea (119). Change in `src/data/emergencyData.js`
- **Offline capable** — Works without internet except for initial app load

---

## 🏆 Contest-Ready Checklist

- [x] Panic Mode with countdown and auto-dial
- [x] AR camera overlays for CPR/Choking/Bleeding/Burns
- [x] Multi-language emergency phrases with TTS
- [x] Gamified training mode with scoring
- [x] Full authentication (login/register/forgot)
- [x] Editable user profile with photo upload
- [x] Emergency contact & blood type in profile
- [x] Dark theme optimized for emergency use
- [x] Haptic feedback throughout
- [x] Works offline

---

**Built with ❤️ for emergency preparedness.**
