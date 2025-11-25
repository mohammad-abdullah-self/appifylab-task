# 🚀 Project Setup Guide

A simple guide to help you set up and run this project on your local machine.

---

## 📥 1. Clone the Repository

Make sure you have **Git** installed before running these commands:

```sh
git clone <repository-url>
cd <project-folder>
git checkout <branch-name>
```

# 🛠️ 2. Install Bun

This project uses Bun as the JavaScript runtime and package manager.

Install Bun globally:

```sh
curl -fsSL https://bun.sh/install | bash
bun --version
```

# ⚙️ 3. Environment Setup

Copy the example environment file:

```sh
cp .env.example .env
```

# 🗄️ 4. Setup Neon Database Connection

This project uses Neon (serverless PostgreSQL). Follow these steps:

Go to [Neon](https://neon.com/) and create a new project.

In the Neon dashboard, get your connection string. It should look like:
```sh
postgresql://<username>:<password>@<host>/<database>?options...
```

# 📦 5. Install Dependencies and Start the Development Server

Install all project dependencies and Run the project in development mode:

```sh
bun install
bun run db:generate
bun run db:migrate
bun dev
```

# Project Discussion

This project is a full-stack social media application built with Next.js for both frontend and backend using Server Actions for seamless API handling. The database is powered by PostgreSQL (hosted on Neon) and accessed via Drizzle ORM, enabling type-safe queries and easy relational mapping. Bun is used as the runtime for faster builds and development. The system supports users, posts, nested comments, and likes, with careful relational design to ensure data integrity and efficient queries. The unified likes table and self-referencing comments allow scalable interactions, while timestamps track creation and updates for posts, comments, and likes.
