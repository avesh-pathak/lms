# Babua LMS: Real Engineering, Not Just Certificates

**Babua LMS** is a premium, pattern-focused Learning Management System designed for the modern software engineer. Moving beyond rote memorization and certificate-chasing, this platform focuses on mastering the core **patterns** of Data Structures, System Design, and Core Engineering.

## 🚀 Key Modules

### 🛠️ The Launchpad
Your central command for technical growth.
- **Mission Active**: A persistent, color-coded status indicator (Rose/Red) for your current learning path (DSA, System Design, etc.).
- **Mastery Orbit**: A high-fidelity SVG visualization of your overall progress and "System Sync" metrics.
- **The Hot Zone**: A reactive engine for high-pressure revisions. Problems needing review are automatically highlighted to ensure pattern solidification through spaced repetition.

### ⚔️ Pattern Gauntlet
The elite testing protocol for engineering wisdom.
- **Battle-Tested Logic**: Interactive, timer-based quiz sessions designed to simulate high-pressure environment.
- **Random Gauntlet**: A 20-question randomized simulation pulling from every loaded topic to test broad pattern recognition.
- **Mission Debriefing**: Detailed analytics on "Efficiency" and scoring, separating "execution" from "protocol" (explanations).

### 🛰️ Mentorship Hub
Rapid-throughput technical support modules.
- **Transmitter SOS**: Broad-signal blockers requiring help in < 24h.
- **Flash Consult (₹149)**: 15-minute high-bandwidth tech/career guidance sessions.
- **Mission Control (₹499)**: 1-hour deep roadmap and architectural planning with elite industry mentors.
- **Integrated Scheduling**: A built-in temporal node (calendar) for booking slots with mentors from Google, Netflix, and more.

### 🔄 Revision Center
A reactive hub for pattern maintenance.
- **Real-time Reactivity**: Problems tagged for revision immediately populate the "Due for Review" section.
- **Solidification Tracking**: Keeps track of every completed pattern to ensure nothing is forgotten.

### 🏆 Community Hub & Leaderboard
- **Global Leaderboard**: Compete with other engineers on pattern mastery and execution speed.
- **Hackathon Hub**: Functional community events to build real-world systems together.

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Design System**: Shadcn UI (Customized with High-Contrast Bold Italic typography)
- **State Management**: React 19 Hooks & Context Providers
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Connection String
- Clerk Environment Variables

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd babua-lms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_uri

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Launch Dev Environment**:
   ```bash
   npm run dev
   ```

## 📂 Project Architecture

- **`app/`**: Next.js App Router (Dashboard, Mentorship, Gauntlet/Quiz, API).
- **`components/`**: 
    - `launchpad.tsx`: Core dashboard engine.
    - `mentorship-booking-dialog.tsx`: Temporal scheduling system.
    - `dashboard-sidebar.tsx`: Dynamic navigation and branding.
- **`lib/`**: 
    - `data/`: Mock mentors and engineering pattern data.
    - `types/`: Domain-specific TypeScript definitions.
    - `mongodb.ts`: High-performance database connection.

---
Built with the **Babua Mindset** — Excellence through execution.
