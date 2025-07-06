# Voice-to-EHR Project

This project is a full-stack application for converting voice input into structured Electronic Health Records (EHR). It consists of a **Next.js frontend** and a **Node.js/Express backend**. This guide will walk you through setting up, running, and understanding the project on your local machine.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Cloning the Repository](#cloning-the-repository)
4. [Environment Variables Setup](#environment-variables-setup)
    - [Backend Environment Variables](#backend-environment-variables)
    - [Frontend Environment Variables](#frontend-environment-variables)
5. [Installing Dependencies](#installing-dependencies)
6. [Running the Applications](#running-the-applications)
    - [Running the Backend](#running-the-backend)
    - [Running the Frontend](#running-the-frontend)
7. [Accessing the Application](#accessing-the-application)
8. [Project Details](#project-details)
9. [Troubleshooting](#troubleshooting)
10. [Useful Commands](#useful-commands)
11. [Additional Resources](#additional-resources)

---

## 1. Project Structure

```
voice-to-ehr-teamwork/
  backend-nodejs/      # Node.js/Express backend
    src/
      routes/
      app.js
    package.json
    ...
  frontend/            # Next.js frontend
    app/
    components/
    pages/
    public/
    package.json
    ...
```

---

## 2. Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

To check if you have these installed, run:

```bash
node -v
npm -v
git --version
```

If you see version numbers, you're good to go. If not, download and install them from:
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 3. Cloning the Repository

Clone the repository to your local machine:

```bash
git clone <your-repo-url>
cd voice-to-ehr-teamwork
```

Replace `<your-repo-url>` with the actual URL of your repository.

---

## 4. Environment Variables Setup

Both the backend and frontend require environment variables for connecting to external services (like Supabase and Azure OpenAI). These variables are **not** included in the repository for security reasons.

### 4.1. Backend Environment Variables

1. Go to the `backend-nodejs` directory:
    ```bash
    cd backend-nodejs
    ```
2. Create a file named `.env` (if it doesn't exist):
    ```bash
touch .env
    ```
3. Open `.env` in a text editor and add the following:
    ```env
    PORT=5001
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    AZURE_OPENAI_DEPLOYMENT=your_azure_openai_deployment_name
    AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
    AZURE_OPENAI_API_KEY=your_azure_openai_api_key
    ```
    - Replace each value with your actual credentials.
    - If you do not have these, contact your project admin or set up the required services.

**What these variables do:**
- `PORT`: The port your backend will run on (default is 5001).
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: Used to connect to your Supabase database.
- `AZURE_OPENAI_*`: Used for AI-powered features (e.g., transcription, analysis).

### 4.2. Frontend Environment Variables

1. Go to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2. Create a file named `.env.local` (if it doesn't exist):
    ```bash
touch .env.local
    ```
3. Open `.env.local` in a text editor and add the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```
    - These should match the Supabase values used in the backend.

**What these variables do:**
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: Allow the frontend to communicate with your Supabase database.

---

## 5. Installing Dependencies

You need to install dependencies for both the backend and frontend **separately**.

### 5.1. Backend

```bash
cd backend-nodejs
npm install
```

### 5.2. Frontend

Open a new terminal window/tab, then:

```bash
cd frontend
npm install
```

---

## 6. Running the Applications

You will need **two terminal windows/tabs**: one for the backend and one for the frontend.

### 6.1. Running the Backend

In the `backend-nodejs` directory:

```bash
npm run dev
```
- This starts the backend server with hot-reloading (using `nodemon`).
- The backend will be available at [http://localhost:5001](http://localhost:5001) by default.
- If you want to run in production mode, use:
  ```bash
  npm start
  ```

### 6.2. Running the Frontend

In the `frontend` directory:

```bash
npm run dev
```
- This starts the Next.js development server.
- The frontend will be available at [http://localhost:3000](http://localhost:3000) by default.
- For production mode:
  ```bash
  npm run build
  npm start
  ```

---

## 7. Accessing the Application

- Open your browser and go to [http://localhost:3000](http://localhost:3000) to use the frontend.
- The frontend will automatically communicate with the backend at [http://localhost:5001](http://localhost:5001).

---

## 8. Project Details

### 8.1. Backend (Node.js/Express)
- Source code: `backend-nodejs/src/`
- Main entry: `backend-nodejs/src/app.js`
- API routes: `backend-nodejs/src/routes/`
- Uses environment variables for Supabase and Azure OpenAI integration.
- Handles:
  - Authentication
  - Patient management
  - Voice transcription and EHR saving

### 8.2. Frontend (Next.js)
- Source code: `frontend/app/`, `frontend/components/`, `frontend/pages/`
- Main entry: `frontend/app/page.tsx`
- Uses environment variables for Supabase integration.
- Handles:
  - User interface
  - Patient and EHR management
  - Voice recording and interaction with backend

---

## 9. Troubleshooting

- **Missing modules:**
  - Run `npm install` in both `backend-nodejs` and `frontend` directories.
- **Port already in use:**
  - Change the `PORT` in your `.env` file or stop the conflicting service.
- **Environment variable errors:**
  - Double-check your `.env` and `.env.local` files for typos or missing values.
- **Supabase/Azure errors:**
  - Ensure your credentials are correct and your services are active.
- **CORS issues:**
  - Make sure the backend allows requests from the frontend's origin (handled by `cors` in backend).
- **Frontend not connecting to backend:**
  - Ensure both servers are running and the ports match those in your environment files.

---

## 10. Useful Commands

### Backend
- `npm run dev` — Start backend in development mode (with hot reload)
- `npm start` — Start backend in production mode

### Frontend
- `npm run dev` — Start frontend in development mode
- `npm run build` — Build frontend for production
- `npm start` — Start frontend in production mode

---

## 11. Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)
- [Node.js Documentation](https://nodejs.org/en/docs)

---

## 12. FAQ

**Q: Do I need to run both frontend and backend?**
- Yes. The frontend provides the user interface, and the backend handles data processing and storage.

**Q: Where do I get Supabase and Azure credentials?**
- You must create accounts on [Supabase](https://supabase.com/) and [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service/) and set up the required services. Follow their documentation for setup.

**Q: Can I change the ports?**
- Yes. Change the `PORT` variable in your `.env` files as needed, but make sure the frontend knows where to find the backend.

**Q: How do I stop the servers?**
- Press `Ctrl+C` in the terminal window where the server is running.

---

If you have any issues, please check the documentation above or contact the project maintainers.