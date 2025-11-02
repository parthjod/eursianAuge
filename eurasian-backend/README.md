# Render Deployment Guide for Eurasian Backend

This guide provides step-by-step instructions for deploying the Flask backend of the Eurasian application on Render.

## 1. Create a New Web Service on Render

- Go to the Render Dashboard and click **New +** > **Web Service**.
- Connect your GitHub or GitLab account and select your repository.

## 2. Configure the Web Service

- **Name**: Give your service a name (e.g., `eurasian-backend`).
- **Region**: Choose a region close to your users.
- **Branch**: Select the branch you want to deploy (e.g., `main`).
- **Root Directory**: `eurasian-backend`.
- **Runtime**: `Python 3`.
- **Build Command**: `pip install -r requirements.txt`.
- **Start Command**: `gunicorn run:app`.
- **Instance Type**: Choose a suitable instance type (e.g., `Free`).

## 3. Add Environment Variables

You will need to add the following environment variables in the Render dashboard under the **Environment** tab:

- `DATABASE_URL`: Your PostgreSQL database URL.
- `SECRET_KEY`: A secret key for session management.
- `REDIS_URL`: Your Redis instance URL for Celery.

## 4. Deploy

- Click **Create Web Service** to deploy your application.
- Render will automatically build and deploy your application. You can monitor the deployment process in the **Logs** tab.

## 5. (Optional) Celery Worker

If you need to run Celery workers, you can create a new **Background Worker** service on Render with the following settings:

- **Name**: `eurasian-celery-worker`.
- **Root Directory**: `eurasian-backend`.
- **Runtime**: `Python 3`.
- **Build Command**: `pip install -r requirements.txt`.
- **Start Command**: `celery -A run.celery worker --loglevel=info`.
- **Environment Variables**: Copy the same environment variables from your web service.
