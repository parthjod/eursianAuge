# Render Deployment Guide for Eurasian Frontend

This guide provides step-by-step instructions for deploying the Next.js frontend of the Eurasian application on Render.

## 1. Create a New Web Service on Render

- Go to the Render Dashboard and click **New +** > **Web Service**.
- Connect your GitHub or GitLab account and select your repository.

## 2. Configure the Web Service

- **Name**: Give your service a name (e.g., `eurasian-frontend`).
- **Region**: Choose a region close to your users.
- **Branch**: Select the branch you want to deploy (e.g., `main`).
- **Root Directory**: `eurasian-frontend`.
- **Runtime**: `Node`.
- **Build Command**: `npm install && npm run build`.
- **Start Command**: `npm start`.
- **Instance Type**: Choose a suitable instance type (e.g., `Free`).

## 3. Add Environment Variables

You will need to add the following environment variables in the Render dashboard under the **Environment** tab:

- `NEXT_PUBLIC_API_URL`: The URL of your deployed backend service (e.g., `https://eursianbackend.onrender.com`).

## 4. Deploy

- Click **Create Web Service** to deploy your application.
- Render will automatically build and deploy your application. You can monitor the deployment process in the **Logs** tab.
