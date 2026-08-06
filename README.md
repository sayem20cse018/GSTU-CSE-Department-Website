# GSTU CSE Department Website

Official website of the **Department of Computer Science and Engineering**, Gopalganj Science and Technology University (GSTU).

---

## 🌐 Live URLs

| Service  | URL |
|----------|-----|
| **Frontend (Vercel)** | https://cse-department-gstu.vercel.app |
| **Backend API (Render)** | https://gstu-cse-department-website.onrender.com/api |
| **API Docs (Swagger)** | https://gstu-cse-department-website.onrender.com/api/docs |
| **Admin Panel** | https://cse-department-gstu.vercel.app/admin/login |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS 11, TypeScript, MongoDB Atlas, Mongoose |
| Auth | JWT (access + refresh tokens), httpOnly cookies |
| Image Upload | Cloudinary (unsigned preset) + base64 fallback |
| Deployment | Vercel (frontend) + Render (backend) |
| Database | MongoDB Atlas (cloud) |

---

## 📁 Project Structure

```
CSE Department Website Project/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Public pages (home, about, faculty, etc.)
│   │   │   ├── (admin)/admin/ # Admin panel pages
│   │   │   └── api/           # Next.js API routes (auth proxy, public proxy)
│   │   ├── components/
│   │   │   ├── layout/        # SiteHeader, Navbar, Footer
│   │   │   ├── sections/      # Homepage sections
│   │   │   └── admin/         # Admin UI components
│   │   ├── lib/               # API helpers, utilities
│   │   └── constants/         # Site-wide constants, nav links
│   └── .env.local             # Local env (not committed)
│
└── backend/           # NestJS API
    ├── src/
    │   ├── modules/
    │   │   ├── auth/           # JWT auth, admin login
    │   │   ├── faculty/        # Faculty CRUD
    │   │   ├── news/           # News articles
    │   │   ├── notice/         # Notice board
    │   │   ├── events/         # Events
    │   │   ├── achievements/   # Department achievements
    │   │   ├── clubs/          # Student clubs
    │   │   ├── gallery/        # Photo gallery albums
    │   │   ├── alumni/         # Alumni directory
    │   │   ├── academics/      # Programs, courses, labs, resources
    │   │   ├── hero-slides/    # Homepage hero slider
    │   │   ├── settings/       # Site settings (singleton)
    │   │   └── statistics/     # Homepage stats counters
    │   └── common/             # Guards, interceptors, filters, decorators
    └── .env                    # Backend env (not committed)
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
npm install
# Create .env from .env.example, fill in MongoDB URI and JWT secrets
npm run start:dev       # http://localhost:4000/api
npm run seed:admin      # Create first super admin
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local (see Environment Variables section below)
npm run dev             # http://localhost:3000
```

---

## 🔐 Admin Panel

**URL:** `/admin/login`

**Default credentials** (after running `npm run seed:admin`):
```
Email:    admin@gstu-cse.edu
Password: Admin@1234
```

> ⚠️ Change the password immediately after first login via Admin Panel → Profile.

### Admin Capabilities

| Section | Admin Can |
|---------|-----------|
| Hero Slides | Add/edit/delete homepage slider slides with images |
| Site Settings | Dept name, logo, contact, social links, About text, About photos, Chairman info |
| Notices | Post, edit, delete, pin notices |
| News | Write, publish, delete news articles |
| Events | Schedule, edit, delete events |
| Achievements | Add/edit/delete department achievements |
| Faculty | Add/edit/delete faculty profiles with photos |
| Alumni | Manage alumni directory |
| Gallery | Create photo albums |
| Clubs | Manage student clubs |
| Academic Programs | BSc/MSc/PhD program details |
| Statistics | Edit homepage counter numbers |

---

## 🌍 Environment Variables

### Frontend (`frontend/.env.local`)

```env
# Backend API URL (used by browser-side code)
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Server-side only (used by Next.js API routes in production)
BACKEND_URL=http://localhost:4000/api

# Cloudinary (image upload) — optional, base64 fallback works without it
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Vercel (Production — set in Dashboard → Settings → Environment Variables)

```
NEXT_PUBLIC_API_URL  = https://gstu-cse-department-website.onrender.com/api
BACKEND_URL          = https://gstu-cse-department-website.onrender.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME    = sybyd7tu
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = gstu-cse-upload
```

### Render (Production — set in Dashboard → Environment)

```
NODE_ENV      = production
PORT          = 4000
MONGODB_URI   = (your Atlas connection string)
JWT_SECRET    = (your secret)
JWT_EXPIRES_IN = 15m
JWT_REFRESH_SECRET  = (your refresh secret)
JWT_REFRESH_EXPIRES_IN = 7d
FRONTEND_URL  = https://cse-department-gstu.vercel.app
```

---

## 📄 Public Pages

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about`, `/about/history`, `/about/vision`, `/about/chairman` |
| Faculty | `/faculty`, `/faculty/[slug]` |
| Academic Programs | `/academics`, `/academics/bsc`, `/academics/msc`, `/academics/phd`, `/academics/mphil` |
| Notices | `/notices` |
| News | `/news`, `/news/[slug]` |
| Events | `/events`, `/events/[slug]` |
| Achievements | `/achievements`, `/achievements/[id]` |
| Clubs | `/clubs`, `/clubs/[slug]` |
| Gallery | `/gallery`, `/gallery/[slug]` |
| Alumni | `/alumni`, `/alumni/register` |
| Admissions | `/admissions` |
| Research | `/research`, `/research/publications` |
| Students | `/students`, `/students/scholarships`, `/students/internship`, `/students/thesis` |
| Forms | `/forms` |
| Contact | `/contact` |
| Search | `/search` |

---

## 🔄 Deployment

### Deploy to Vercel (Frontend)
```bash
cd frontend
npx vercel --prod --yes
```

Or push to `main` branch — Vercel auto-deploys via GitHub integration.

### Deploy to Render (Backend)
Render auto-deploys from the `main` branch.
Make sure all environment variables are set in Render dashboard.

---

## 📸 Image Upload

Images can be uploaded in two ways:

1. **Cloudinary** (recommended for production): Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (must be **Unsigned** mode). Images are stored on Cloudinary CDN and only the URL is saved to the database.

2. **Base64 fallback** (automatic if Cloudinary not configured): Image is converted to base64 and stored directly in MongoDB. Works out of the box but increases database document size. Limit: 5 MB per image.

---

## 👤 Developer

**Developer:** Musa  
**Repository:** https://github.com/sayem20cse018/GSTU-CSE-Department-Website  
**Department:** CSE, GSTU

---

*Built with ❤️ for the Department of Computer Science and Engineering, GSTU*
