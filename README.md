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

# 📦 4. Install Dependencies and Start the Development Server

Install all project dependencies and Run the project in development mode:

```sh
bun install
bun dev
```
