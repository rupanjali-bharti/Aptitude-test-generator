# Frontend Documentation

## Overview
React.js frontend for the Aptitude Test Generator application.

## Project Structure

```
src/
├── components/
│   ├── Test.js           # Main test interface component
│   └── TestResults.js    # Results and analysis display
├── pages/
│   ├── Home.js           # Home page with test generation form
│   └── TestsList.js      # List of available tests
├── styles/
│   ├── index.css         # Global styles
│   ├── Home.css
│   ├── Test.css
│   ├── TestsList.css
│   └── TestResults.css
├── utils/
│   └── api.js            # API client and endpoints
├── App.js                # Main app component
├── App.css
└── index.js              # React entry point
```

## Pages & Components

### 1. Home Page (`pages/Home.js`)
- Company and job description input form
- Generate tests button
- Features overview
- Responsive design

**Features:**
- Input validation
- Loading state handling
- Success/error messages
- Auto-redirect after generation

### 2. Tests List (`pages/TestsList.js`)
- Display all generated tests for a company
- Start test button for each test
- Test metadata display
- Results view integration

### 3. Test Component (`components/Test.js`)
- Interactive test interface
- Real-time countdown timer
- Progress tracking
- Multiple choice questions
- Question navigation
- Answer submission

**Features:**
- Question-by-question navigation
- Time spent tracking
- Answer indicator grid
- Auto-submit on time limit

### 4. Test Results (`components/TestResults.js`)
- Accuracy score display
- Topic-wise performance breakdown
- Strong and weak topics
- AI-generated insights
- Personalized recommendations
- Visual progress indicators

## Styling

### Design System
- **Primary Color**: #2196f3 (Blue)
- **Secondary Color**: #64b5f6 (Light Blue)
- **Success Color**: #4caf50 (Green)
- **Danger Color**: #f44336 (Red)
- **Warning Color**: #ff9800 (Orange)

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## API Integration

### API Client (`utils/api.js`)

```javascript
// Generate tests
generateTests(company, jobDescription, numberOfTests)

// Fetch tests
getCompanyTests(company)

// Submit answers
submitTest(testId, userId, answers)

// Get results
getTestResult(resultId)
```

## Key Features

### 1. Test Taking
- Timed tests with countdown
- Progress bar
- Question navigator
- Answer tracking
- Keyboard navigation support

### 2. Results Display
- Accuracy percentage
- Score breakdown
- Topic-wise analysis
- Visual charts
- Recommendations

### 3. Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts
- Optimized for all screen sizes

## State Management

Uses React hooks:
- `useState` - Component state
- `useEffect` - Side effects
- `useParams` - Route parameters

## External Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "axios": "^1.5.0"
}
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
```

## Development

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Browser Support
- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest

## Performance Optimizations
- Code splitting with React Router
- Lazy loading
- CSS optimization
- Image optimization

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- High contrast ratios
- Focus management

## Error Handling
- API error messages
- Form validation
- Loading states
- Graceful degradation

---

For frontend setup instructions, see [QUICK_START.md](../QUICK_START.md)
