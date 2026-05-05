# WaGraph - AI Image Generation Mobile App

A powerful mobile application for generating stunning images using advanced AI models. WaGraph leverages cutting-edge technology to create high-quality images with customizable styles, aspect ratios, and generation parameters.

## Features

### 🎨 Multiple AI Models
- **SDXL Base** - Highest quality images with advanced detail (slower generation)
- **SDXL Lightning** - 4× faster generation without compromising quality
- **Dreamshaper** - Creative and artistic image generation

### 🎭 Style Presets
Choose from 10+ predefined artistic styles:
- Cinematic - Dramatic lighting and film grain
- Anime - Vibrant and highly detailed
- Ghibli - Hand-drawn animation style
- Oil Paint - Impressionist brushstrokes
- Neon Noir - Cyberpunk aesthetic
- Watercolor - Delicate illustrations
- 3D Render - Photorealistic rendering
- Pixel Art - Retro game sprite style
- Sketch - Detailed pencil sketches
- And more...

### ⚙️ Advanced Controls
- **Custom Prompts** - Describe exactly what you want to generate
- **Negative Prompts** - Specify what to exclude from images
- **Aspect Ratio Selection** - Choose from various image dimensions
- **Generation Settings** - Fine-tune steps, guidance scale, and seed values
- **Real-time Feedback** - Live generation timer showing elapsed time

### 📱 Mobile-First Design
- Dark theme optimized for comfortable viewing
- Smooth animations and transitions with Reanimated
- Gesture-based navigation
- One-tap sharing and saving to photo library

### 📚 Advanced Image Gallery
- Browse all generated images in responsive 2-column grid
- Fullscreen viewer with image controls
- Image details modal with metadata (model, dimensions, prompt)
- Sort images by: newest, oldest, or model used
- Smooth skeleton loading animations
- Delete images from gallery with confirmation
- Download images directly to photo library
- Pull-to-refresh gallery

### 🎯 Performance & Architecture
- Centralized styling with theme constants
- Component-based architecture with extracted sub-components
- Optimized state management with Zustand-like store
- Efficient image loading with Cloudinary optimization
- Comprehensive error logging for debugging API issues

## Tech Stack

### Framework & Runtime
- **Expo** ~53.0 - React Native framework for cross-platform development
- **React** 19.0 - UI library
- **React Native** 0.79.6 - Cross-platform mobile framework
- **Expo Router** ~5.1 - File-based routing system

### UI & Animation
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Blur** - Blur effects
- **React Native Reanimated** - Advanced animations
- **React Native Gesture Handler** - Touch gesture support
- **Expo Vector Icons** - Icon library

### Storage & Media
- **Expo File System** - File management
- **Expo Media Library** - Photo library integration
- **Expo Image** - Optimized image display
- **Expo Asset** - Asset management

### Backend & APIs
- **Cloudinary** - Image optimization and delivery
- **Cloudflare Workers API** - Image generation backend

### State Management
- Custom store using React hooks (Zustand-like pattern)

### Utilities
- **Expo Sharing** - Share generated images
- **Expo Constants** - App configuration
- **Expo Linking** - Deep linking support
- **dotenv** - Environment configuration

## Project Structure

```
WaGraph/
├── app/                          # App screens & routing
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── index.js             # Home/Generate tab 
│   │   ├── history.js           # Image history/gallery tab 
│   │   └── settings.js          # Settings tab
│   ├── _layout.js               # Root layout
│   └── (tabs)/_layout.js        # Tab layout
├── components/                   # Reusable React components
│   ├── generate/                # Image generation components
│   │   ├── GenerateButton.js    # Main generation trigger
│   │   ├── PromptInput.js       # Text input for prompts
│   │   ├── ModelSelector.js     # AI model selection
│   │   ├── AspectRatioSelector.js # Image dimension picker
│   │   ├── StylePresets.js      # Style selection
│   │   ├── SuggestionPicker.js  # Prompt suggestions
│   │   └── ResultCard.js        # Generated image display
│   ├── history/                 # Gallery screen components 
│   │   ├── ImageCard.js         # Gallery card with image
│   │   ├── SkeletonCard.js      # Loading placeholder
│   │   ├── SaveBtn.js           # Download/save button
│   │   ├── FullscreenViewer.js  # Fullscreen image modal
│   │   ├── DetailModal.js       # Image details modal
│   │   ├── StatBox.js           # Individual stat badge
│   │   ├── EmptyState.js        # Empty gallery message
│   │   ├── ErrorState.js        # Error display
│   │   └── SortPill.js          # Sort option button
│   └── ui/                      # Generic UI components
│       ├── DotsLoader.js        # Loading animation
│       ├── ParticleField.js     # Particle effects
│       ├── ShimmerBox.js        # Shimmer loading state
│       └── SectionLabel.js      # Section headers
├── hooks/                        # Custom React hooks
│   ├── useGenerate.js           # Image generation logic
│   └── useStore.js              # State management hook
├── store/                        # Application state
│   └── appStore.js              # Zustand-like store
├── styles/                       # Styling & theming
│   ├── theme.js                 # Color and typography constants
│   ├── generateScreenStyles.js  # Generate tab styles (extracted)
│   ├── historyStyles.js         # History tab styles (extracted)
│   └── resultCardStyles.js      # Result card styles (extracted)
├── utils/                        # Utility functions
│   ├── api.js                   # API calls, model definitions, logging
│   ├── cloudinary.js            # Cloudinary image optimization
│   └── gallery.js               # Image gallery utilities
├── assets/                       # Images & static files
├── app.json                      # Expo app configuration
├── eas.json                      # EAS build configuration
├── .env                          # Environment variables (required)
├── package.json                  # Dependencies
├── index.js                      # Entry point
└── README.md                     # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Or use Expo Go app on your phone

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WaGraph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_API_URL=your_api_url
   EXPO_PUBLIC_API_KEY=your_api_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

- **Start development server**: `npm start`
- **Run on iOS**: `npm run ios`
- **Run on Android**: `npm run android`
- **Run on Web**: `npm run web`
- **Use Expo Go**: Scan the QR code with Expo Go app

## Usage

### Generating an Image

1. **Open the app** and navigate to the Generate tab
2. **Enter your prompt** - Describe what you want to generate
3. **Select a model** - Choose between SDXL Base, Lightning, or Dreamshaper
4. **Pick a style** - Select a predefined style or use "None" for default
5. **Choose aspect ratio** - Select image dimensions
6. **Customize (optional)**:
   - Add negative prompts to exclude elements
   - Adjust steps, guidance scale, and seed in settings
7. **Generate** - Tap the generate button and wait for results
8. **Save or Share** - Store to photo library or share directly

### Managing History

- Visit the **History** tab to see all generated images
- View original prompts and settings for any image
- Re-use settings for similar generations

### Customizing Settings

- Access **Settings** tab for:
  - Default generation parameters
  - UI preferences
  - Cache management

## Configuration

### app.json
Contains Expo configuration including:
- App name and slug
- Version and build settings
- iOS and Android-specific configurations
- Photo library permissions
- Theme settings (dark mode by default)

### .env Variables
- `EXPO_PUBLIC_API_URL` - Backend API endpoint
- `EXPO_PUBLIC_API_KEY` - Authentication token

## API Integration

The app uses a Cloudflare Workers backend for image generation. Key endpoints:

- **Generate Image**: `/api/generate`
  - Accepts: prompt, model, negative prompt, settings
  - Returns: Generated image URL and metadata

## Permissions

### iOS
- Photo Library read/write access (to save generated images)

### Android
- Internet access
- Read/write external storage (for image saving)
- Read media images

## Performance Optimization

- Images optimized through Cloudinary
- Lazy loading for image history
- Efficient state management with Zustand-like store
- Memoized components for render optimization

## Building for Production

### Build with EAS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Log in to EAS**
   ```bash
   eas login
   ```

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

5. **Submit to stores**
   ```bash
   eas submit
   ```

## Troubleshooting

### Generation fails
- Check internet connection
- Verify API credentials in `.env` file
- Check API endpoint availability
- Check console logs for detailed error messages

### Models not loading
- Ensure `.env` file exists with valid `EXPO_PUBLIC_API_KEY`
- Verify API endpoint `EXPO_PUBLIC_API_URL` is correct
- Check console logs for HTTP 401 (Unauthorized) or other API errors
- Confirm API token is active and has correct permissions

### Images not saving
- Verify photo library permissions are granted
- Check available storage space
- Ensure valid file paths
- Check Cloudinary configuration

### Gallery shows error message
- Pull-to-refresh to retry loading images
- Check internet connection
- Verify API credentials
- Check console logs for specific error details

### App crashes on startup
- Clear cache: `npm start -- --clear`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Check Expo CLI version: `expo --version`
- Verify all environment variables are set in `.env`

### UI Components not rendering
- Clear Metro bundler cache: `npm start -- --clear`
- Verify all component exports are correct
- Check for circular import dependencies
- Ensure style files are properly imported

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source.

## Support

For issues, questions, or suggestions, please open an issue on the repository or contact me.

## Recent Improvements & Refactoring

### Architecture Optimization
- **Component Extraction**: Large monolithic components split into focused, reusable sub-components
  - ResultCard refactored into specialized components
  - History screen refactored with 9 extracted gallery components
  
- **Centralized Styling**: All StyleSheet objects moved from components to dedicated style files
  - `generateScreenStyles.js` - All Generate tab styling
  - `historyStyles.js` - All Gallery tab styling  
  - `resultCardStyles.js` - Result card styling
  - Enables theme updates in single location

- **Enhanced Error Logging**: Comprehensive console logging in API functions
  - API requests now log endpoint and parameters
  - Responses show success/failure with detailed error messages
  - Helps debug connectivity and authentication issues

### UI/UX Improvements
- Fixed delete button visibility (improved opacity and border contrast)
- Centered save button text for better visual alignment
- Added skeleton loading animations in gallery
- Improved modal layouts and button styling
- Better error state displays with retry functionality

### Code Quality
- Removed unused imports across all files
- Proper component function exports
- Consistent import path resolution
- Better separation of concerns between components

## Changelog

### Version 1.1.0 (May 2026)
- Architecture refactoring: Component extraction and centralized styling
- Enhanced error logging for API debugging
- Improved UI/UX with better button styling and visibility
- Fixed gallery screen rendering and component composition
- Code quality improvements: removed unused imports and optimized structure
- Better error handling and user feedback in gallery operations

### Version 1.0.0
- Initial release
- Multiple AI models for image generation
- 10+ style presets
- Advanced generation controls
- Image history tracking
- Cross-platform support (iOS, Android, Web)

## Credits

- Built with [Expo](https://expo.dev/)
- AI Models: SDXL, Dreamshaper
- Image Optimization: [Cloudinary](https://cloudinary.com/)
- Backend: [Cloudflare Workers](https://workers.cloudflare.com/)

---

**Version**: 1.1.0  
**Last Updated**: May 2026  
**Owner**: senku212134
