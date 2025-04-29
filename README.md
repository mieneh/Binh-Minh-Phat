# Binh Minh Phat Import Export Garment Company Limited

---

## Overview

A website and administration system for **Binh Minh Phat Import Export Garment Company Limited**, including:

- Public website (company profile, products, careers, contact)
- Admin Dashboard for management and operations

---

## Tech Stack

### Backend
- **Node.js**
- **NestJS**
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **i18n (nestjs-i18n)**
- **Cloudinary** (image upload)
- **Nodemailer** (email notifications)

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**
- **React Toastify**

---

## Features

### Website
- Homepage
- Company introduction
- Product listing
- Partners
- Careers
- Job application submission
- Contact form
- Multi-language support (VI / EN)

### Admin Dashboard
- Category management
- Product management
- Partner management
- Department & position management
- Recruitment management
- Applicant management
- Contact management
- Branch address management
- User management
- **Notification system**
- Reusable pagination for tables
- Password change & profile editing

---

## Internationalization (i18n)

- Full English support
- Translated UI, content, and system messages

---

## Environment Variables

### Backend (`.env`)
```env
PORT=3000
MONGODB_URI=mongodb_url
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

MAIL_HOST=xxx
MAIL_PORT=xxx
MAIL_USER=xxx
MAIL_COMPANY=xxx
MAIL_PASS=xxx
```

### Frontend (`.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

---

## Run Project

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Git Convention

This project follows **Conventional Commits**:

```bash
feat: add new feature
fix: fix bug
refactor: improve code structure
chore: tooling or configuration
```

---

## Author

**Mie**
Project for **Binh Minh Phat Import Export Garment Company Limited**

---

## License

This project is for internal/company use only.
