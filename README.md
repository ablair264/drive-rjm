# Drive RJM - Landing Page

Professional driving instruction landing page for Drive RJM, built with React, Tailwind CSS, and Framer Motion with comprehensive SEO optimization.

## Features

### Design & UI
- **Dynamic Geometric Design**: "Velocity & Trust" aesthetic with sharp angles and bold red accents
- **Framer Motion Animations**: Scroll-triggered reveals, parallax effects, spring physics
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Custom Typography**: Rajdhani (display) + Plus Jakarta Sans (body)
- **Interactive Components**: FAQ accordion, hover effects, 3D transforms

### SEO Optimization
- **Comprehensive Meta Tags**: Open Graph, Twitter Cards, geo-location
- **JSON-LD Structured Data**:
  - LocalBusiness/DrivingSchool schema
  - Person schema (instructor)
  - Service schema
  - FAQPage schema
  - Breadcrumb schema
  - Product schema
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Performance**: Preloaded fonts, optimized assets

### Sections
1. **Hero**: Bold headline with CTA and areas covered strip
2. **About**: Rowan's story with highlight cards
3. **Services**: Learner training, confidence boosting, towing
4. **Car**: SEAT Leon features and specifications
5. **Manual**: Why choose manual transmission
6. **FAQ**: 8 common questions with accordion
7. **Contact**: Phone, email, location with prominent CTA

## Tech Stack

- **React 18**: Component-based UI
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **React Helmet Async**: SEO and meta tag management

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The dev server will start at `http://localhost:3000` and open automatically.

### Project Structure

```
DriveRJM/
├── src/
│   ├── components/
│   │   └── SEO.jsx          # Structured data & SEO schemas
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Tailwind imports & custom styles
├── index.html                # HTML template with SEO meta tags
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
└── postcss.config.js         # PostCSS configuration
```

## Customization

### Colors
Update the learner red and other colors in `tailwind.config.js`:

```js
colors: {
  'learner-red': '#D7171F',
  'dark': '#1a1a1a',
  // ...
}
```

### Fonts
Modify fonts in `tailwind.config.js` and update Google Fonts import in `index.html`.

### Content
Edit content directly in `src/App.jsx` component sections or extract to separate data files.

### SEO
Update business information, schemas, and meta tags in:
- `src/components/SEO.jsx` (JSON-LD structured data)
- `index.html` (meta tags, Open Graph, Twitter Cards)

## Firebase Admin Setup

The admin dashboard stores students and lessons in Firestore. A helper script seeds those collections with template documents so Firestore is initialised with the expected structure.

1. **Service account**: Download a Firebase service-account JSON for the project and save it as `ServiceAccountKey.json` in the repo root (or point to another path via the `FIREBASE_SERVICE_ACCOUNT` env var).
2. **Install deps**: `npm install` (installs `firebase-admin`).
3. **Seed Firestore**:
   ```bash
   npm run setup:firestore
   # or specify a custom credential file
   FIREBASE_SERVICE_ACCOUNT=/path/to/key.json npm run setup:firestore
   ```
   The script creates template docs for `students`, `lessons`, `recentlyPassed`, and `enquiries` collections so the dashboard has sample data.
4. **Deploy indexes**: Firestore requires composite indexes for the dashboard queries (students, lessons, tests). Deploy them with:
   ```bash
   firebase deploy --only firestore:indexes
   ```
   (Uses `firebase.json` + `firestore.indexes.json`. Pass `--project <project-id>` if the Firebase CLI isn’t already pointing at the right project.)

### Student Photos & Enquiries

- Student portraits are uploaded to Firebase Storage automatically when you add a student via the admin dashboard. The resulting download URL is stored in the `image` field of each `students` document.
- You can also paste an existing image URL into the student form; uploaded files take precedence over typed URLs.
- All public-facing enquiry forms now write directly to the `enquiries` collection in Firestore, so the admin dashboard reflects real submissions in real time.

## SEO Checklist

- [x] Comprehensive meta tags (title, description, keywords)
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags
- [x] Geo-location meta tags
- [x] Canonical URL
- [x] LocalBusiness JSON-LD schema
- [x] Person schema (instructor)
- [x] Service schema
- [x] FAQPage schema
- [x] Breadcrumb schema
- [x] Product schema
- [x] Semantic HTML structure
- [x] Alt text placeholders for images
- [x] Robots meta tag
- [x] Language specification
- [x] Theme color
- [x] Favicon links

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy Options

1. **Netlify/Vercel**: Connect your Git repository for automatic deployments
2. **Static Hosting**: Upload `dist/` contents to any static host
3. **Custom Server**: Serve `dist/` with nginx, Apache, or Node.js

### Environment Variables

For production, update these URLs in the codebase:
- Canonical URL in `index.html`
- Business URLs in `src/components/SEO.jsx`
- Open Graph images (create and upload)

## Images

Replace image placeholders with actual photos:
- Hero image: Rowan with car or happy student (1200x900px)
- About image: Rowan portrait (900x1200px)
- Car image: SEAT Leon exterior (1600x1000px)
- OG image: Social sharing image (1200x630px)
- Twitter image: Social sharing image (1200x600px)
- Favicon: Logo as SVG and PNG

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance

- Lazy loading for images (implement when adding real images)
- Code splitting via Vite
- Minimal dependencies
- CSS purging via Tailwind (production)
- Preloaded critical fonts

## License

© 2025 Drive RJM Ltd. All rights reserved.

## Contact

**Drive RJM**
Orchard House, Orchard Farm
Worcester Road, Great Witley
WR6 6HU

Phone: [07539 283257](tel:07539283257)
Email: [rowan@driverjm.co.uk](mailto:rowan@driverjm.co.uk)
Website: [www.driverjm.co.uk](https://www.driverjm.co.uk)
