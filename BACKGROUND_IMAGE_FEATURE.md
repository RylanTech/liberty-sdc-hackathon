# Dynamic Background Image Feature

## Overview
The CreatePlan component now includes dynamic background image functionality that changes the page background to a blurred, high-resolution image of the selected destination.

## How It Works

### 1. Image Fetching Strategy
When a user selects a destination from the autocomplete suggestions, the system attempts to fetch a relevant image using multiple fallback approaches:

#### Approach 1: Google API (Primary)
- Attempts to fetch images from the Google Search API
- Searches for `${destinationName} travel destination`
- Filters and sorts images by resolution to get the highest quality
- **Note**: Currently may have API subscription limitations

#### Approach 2: Unsplash Fallback
- Uses Unsplash's Source API for destination images
- Fetches 1920x1080 resolution images
- Format: `https://source.unsplash.com/1920x1080/${destinationName}`

#### Approach 3: Curated Image Collection
- Predefined high-quality images for popular destinations:
  - Paris: Eiffel Tower view
  - London: Big Ben and Parliament
  - Tokyo: City skyline
  - New York: Manhattan skyline
  - Rome: Colosseum
  - Barcelona: City overview
  - Amsterdam: Canal houses
  - Sydney: Opera House and Harbor Bridge

#### Approach 4: Generic Travel Image
- Final fallback: Beautiful generic travel/airplane image
- Ensures users always get an enhanced visual experience

### 2. Visual Effects

#### Background Styling
- **Default**: Clean gradient background (`#fdf6e3` to `#e0eafc`)
- **With Image**: Blurred destination image with overlay
  - Semi-transparent gradient overlay (85% opacity)
  - `background-size: cover` for full coverage
  - `background-position: center` for optimal framing
  - `background-attachment: fixed` for parallax effect
  - Smooth transition animation (0.5s ease-in-out)

#### Card Enhancement
- **Default**: White background with subtle shadow
- **With Image**: Enhanced visibility
  - Semi-transparent white background (95% opacity)
  - `backdrop-filter: blur(10px)` for glass effect
  - Increased shadow for better separation
  - Smooth transition animation

### 3. User Experience

#### Loading States
- Spinner indicator appears in the destination input field while fetching images
- Non-blocking: users can continue filling the form while image loads

#### Performance Optimizations
- Images are fetched only when a destination is selected (not while typing)
- Multiple fallback strategies ensure images are always available
- High-resolution images (1920x1080+) for crisp display on all devices

## Implementation Details

### State Management
```jsx
const [backgroundImage, setBackgroundImage] = useState("");
const [imageLoading, setImageLoading] = useState(false);
```

### Key Functions
- `fetchDestinationImage(destinationName)`: Main image fetching function
- `handleDestinationSelect(suggestion)`: Handles destination selection and triggers image fetch

### Environment Variables
- `VITE_X_RAPIDAPI_KEY`: API key for Google Search API access

## Testing the Feature

1. **Start both servers**:
   - Backend: `cd back-end && npm run dev` (Port 3001)
   - Frontend: `cd front-end/lol && npm run dev` (Port 5173)

2. **Test the functionality**:
   - Navigate to the "Create a plan" page
   - Start typing a destination (e.g., "Paris")
   - Select a destination from the dropdown
   - Watch the background change to a beautiful image of that destination

3. **Test different destinations**:
   - Try major cities: Paris, London, Tokyo, New York
   - Try other locations to see fallback behavior
   - Notice the smooth transitions and enhanced visual appeal

## Browser Compatibility
- Modern browsers with CSS `backdrop-filter` support
- Graceful degradation for older browsers (standard background)
- Responsive design works on all screen sizes

## Future Enhancements
- Add more curated destination images
- Implement image caching for better performance
- Add user preference for background images on/off
- Integrate with additional image APIs for better coverage
