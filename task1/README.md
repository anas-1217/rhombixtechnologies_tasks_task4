# Quill & Ink — MERN Blog

Dynamic blogging site: public reading, search, categories/tags, comments, image upload, rich-text editing, and a JWT-protected admin studio.

## Structure

```
r3/task2/
  server/     Express + MongoDB API
  client/     React (Vite) front end
```

## Run locally

```bash
cd server
npm install
npm start

cd ../client
npm install
npm run dev
```

- API: http://localhost:5001
- App: http://localhost:5174

## Accounts

Seeded admin (created on first server start):

- Email: `admin@blog.com`
- Password: `admin123`

Readers can register from the site and comment on published posts.

## Environment (`server/.env`)

MongoDB Atlas cluster `cluster0.kyrmptc.mongodb.net`, database `blogsite`.
