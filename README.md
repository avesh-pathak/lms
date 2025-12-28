# DSA Problem Tracker

A comprehensive dashboard to track your Data Structures and Algorithms (DSA) problem-solving journey. Built with **Next.js 15**, **MongoDB**, and **Tailwind CSS**.

## Features

- **📊 Interactive Dashboard**: Get a high-level view of your progress across various topics.
- **📝 Problem Management**: Track problem status (Pending, In Progress, Completed), difficulty, and star your favorites.
- **📈 Analytics**: Visualize your solving activity, streaks, and progress over time.
- **⏱️ Focus Timer**: Built-in timer to manage your practice sessions effectively.
- **🏷️ Smart Tagging**: Organize problems with custom tags and filter them easily.
- **💾 Hybrid Sync**: Fetches problem sets from MongoDB while persisting your personal notes, solutions, and time spent in Local Storage.
- **🌑 Dark Mode**: Polished UI with full dark mode support using `next-themes`.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **State Management**: React Hooks & Local Storage
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your MongoDB connection URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect you to the dashboard.

## Project Structure

- **`app/`**: Next.js App Router pages (Dashboard, API routes).
- **`components/`**: UI components including:
  - `topic-detail.tsx`: Main view for a specific topic's problems.
  - `analytics-dashboard.tsx`: Visual analytics and charts.
  - `problem-notes.tsx`: Rich text notes for problems.
  - `ui/`: Reusable primitive components (buttons, dialogs, etc.).
- **`lib/`**: Utilities and configurations:
  - `mongodb.ts`: Database connection helper.
  - `local-storage.ts`: Helpers for syncing user state.
  - `types.ts`: TypeScript interfaces for Problems and Topics.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
