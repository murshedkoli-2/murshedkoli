# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and MongoDB.

## 🚀 Features

- **Soft-luxury design**: Warm, muted, premium aesthetic with an editorial serif/sans pairing
- **Light & dark themes**: Animated toggle with a no-flash pre-paint script; both themes are intentional
- **Balanced motion**: Cinematic hero + smooth scroll reveals, with full `prefers-reduced-motion` support
- **Responsive**: Optimized for all device sizes
- **Admin Panel**: Content management for projects, services, skills, experience, certificates, and profile
- **Services section**: "What I do" capabilities, managed from the dashboard
- **Minimal project case studies**: Visual `/projects/[slug]` pages with gallery lightbox
- **Fast & secure**: Server-rendered pages, security headers/CSP, auth-guarded APIs, rate-limited public forms
- **Database Integration**: MongoDB with Prisma ORM
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS + CSS custom-property design tokens (OKLCH)
- **Fonts**: Fraunces (display) + Inter (body) via `next/font`
- **Database**: MongoDB with Prisma
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your actual values:
- MongoDB connection string
- Admin credentials
- NextAuth configuration

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

## 🚀 Deployment on Vercel

### Prerequisites
- Vercel account
- MongoDB Atlas database
- GitHub repository

### Step-by-Step Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   In your Vercel dashboard, add these environment variables:
   ```
   DATABASE_URL=mongodb+srv://...
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**:
   - Click "Deploy" in Vercel
   - Your site will be live at `https://your-project.vercel.app`

### Important Notes

- ✅ All API routes have proper TypeScript imports
- ✅ Build process is optimized for production
- ✅ Environment variables are properly configured
- ✅ Database connection is production-ready
- ✅ Middleware is correctly set up

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/               # Utility libraries
├── prisma/            # Database schema
├── public/            # Static assets
└── scripts/           # Database seeding scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Admin Access

Access the admin panel at `/admin/login` with your configured credentials.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

If you have any questions or need help with deployment, please open an issue.