# Job Updates Portal

A modern, fully responsive job portal built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features a professional navbar with glassmorphism effects, dark/light theme support, and production-level component architecture.

## Features

### 🎨 UI/UX
- **Responsive Design**: Fully optimized for mobile, tablet, laptop, and ultra-wide screens
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Glassmorphism Effects**: Modern blur and transparency effects
- **Smooth Animations**: Framer Motion animations and transitions
- **Professional Color Palette**: Carefully designed color scheme with primary, secondary, and accent colors
- **Semantic HTML**: Accessible and semantic markup throughout

### 🧩 Components
- **Navbar**: Sticky navbar with mobile hamburger menu, active link highlighting, and smooth animations
- **Buttons**: Reusable button component with multiple variants (primary, secondary, ghost, outline)
- **Cards**: Animated card component with hover effects
- **Badge**: Status badges for job types and categories
- **Skeleton**: Loading placeholder components
- **EmptyState**: Beautiful empty state screens

### 📱 Pages
- **Home**: Hero section, featured jobs, statistics, and CTA
- **Jobs**: Comprehensive job listings with search and filters
- **Companies**: Browse top hiring companies
- **Internships**: Dedicated internship opportunities
- **Remote Jobs**: Remote-first job opportunities
- **Career Tips**: Professional development articles and guides

### ⚡ Performance
- Server-side rendering with Next.js App Router
- Optimized images and lazy loading
- Tailwind CSS for minimal CSS output
- Production-ready code structure

### 🔒 Best Practices
- TypeScript for type safety
- Modular component structure
- Reusable utility components
- Consistent spacing and typography
- Accessible navigation and interactions
- SEO optimized metadata

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3
- **Animations**: Framer Motion 10.16
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will auto-refresh on code changes

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
job-updates-portal/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx       # Main navigation with theme toggle
│   │   ├── Button.tsx       # Button component with variants
│   │   ├── Card.tsx         # Card component with animations
│   │   ├── Badge.tsx        # Badge/tag component
│   │   ├── Skeleton.tsx     # Loading skeleton
│   │   ├── EmptyState.tsx   # Empty state component
│   │   └── index.ts         # Component exports
│   ├── jobs/                # Jobs page
│   ├── companies/           # Companies page
│   ├── internships/         # Internships page
│   ├── remote/              # Remote jobs page
│   ├── tips/                # Career tips page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── providers.tsx        # Theme provider
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## Customization

### Theme Colors
Edit `tailwind.config.ts` to customize the color palette:
- Primary: Sky blue
- Secondary: Purple
- Accent: Pink

### Adding New Pages
1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Import components from `app/components`

### Styling
- Use Tailwind CSS utility classes for styling
- Add custom styles in `app/globals.css`
- Use `@layer` for custom component classes

### Animations
- Use Framer Motion's `motion` components
- Variants are defined in component files
- Customize animation duration and easing as needed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

✅ Image optimization with Next.js Image component
✅ Font optimization with next/font
✅ Code splitting and lazy loading
✅ Minified CSS with Tailwind
✅ SEO metadata and Open Graph tags
✅ Responsive images for different screen sizes

## Accessibility

✅ Semantic HTML elements
✅ ARIA labels on interactive elements
✅ Keyboard navigation support
✅ Color contrast ratios meet WCAG standards
✅ Focus states on buttons and links

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Laptop**: 1024px - 1280px
- **Desktop**: > 1280px

## Environment Variables

Currently, no environment variables are required for basic functionality. For production deployment, you may want to add:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
The application builds to a static site that can be deployed to any hosting platform supporting Node.js.

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
