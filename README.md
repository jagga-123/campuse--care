# CampusCare

CampusCare is an AI-powered smart complaint management system for colleges and universities.

It supports three user roles:

- Student
- Administrator
- Staff Member

## What is included

- React frontend starter with a polished dashboard-style landing page
- Express + MongoDB backend scaffold
- Complaint, user, and department data models
- Role-based route structure
- AI helpers for complaint categorization and priority detection

## Project Structure

```text
CampusCare/
├── client/
├── server/
├── models/
├── routes/
├── controllers/
├── middleware/
├── public/
└── README.md
```

## Frontend

- React.js
- Tailwind CSS
- Lucide React Icons
- Recharts ready for analytics

## Backend

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT authentication

## Getting Started

Install dependencies inside both apps:

```bash
cd client
npm install

cd ../server
npm install
```

Run both sides in separate terminals:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```

## Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campuscare
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
```

## Next Steps

- Connect the complaint forms to the API
- Add real Google Maps heatmap integration
- Replace the sample dashboard data with database queries
- Add file upload support for complaint evidence

