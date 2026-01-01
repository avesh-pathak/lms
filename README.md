# 🏆 Babua LMS: The Neural Engineering Protocol

[**Explore the Deployment**](https://aveshpathaklms.vercel.app/)

**Babua LMS** is a high-performance, open-source Learning Management System engineered for the modern software developer. Built with the **Babua Mindset**, this platform rejects "certificate-chasing" in favor of mastering high-fidelity engineering patterns through mentor-led accountability and live simulations.

---

## 🎯 Project Vision
Our mission is to deliver elite tech education for free. We operate on a **"Value-Added Human Interaction"** model: 100% of the theory, engineering notes, and patterns are free forever. We only monetize direct human time and high-bandwidth mentorship.

### 🧠 Core Philosophy
- **Real Engineering**: Focus on patterns, not syntax memorization.
- **Pattern Gauntlet**: High-pressure testing for mental muscle memory.
- **Neural Coalitions**: Shared growth through mentor-led accountability squads.
- **Ethical Revenue**: Low-cost, optional monetization that students *want* to pay for.

---

## 🚀 Key Features

### ⚔️ Pattern Gauntlet (The Warzone)
Instead of static quizzes, we use timer-based simulations designed to test broad pattern recognition under pressure. Master DSA and System Design patterns by executing under the clock.

### 🛰️ Mentorship Hub (Mission Control)
A high-throughput support module for booking deep-dive sessions.
- **Flash Consults (₹149)**: 15-minute high-bandwidth blocker clearing.
- **Roadmap Planning (₹499)**: 1-hour architectural strategy with elite mentors.

### 👥 Neural Coalitions (Babua Squads)
Join mentor-led elite squads for recursive growth.
- **The Manifesto**: Each squad has a unique technical goal (e.g., L6 Distributed Systems, Frontend Architecture).
- **Paid Accountability**: Pay for the system that forces you to finish, including direct PR and architecture reviews.

### 🛠️ Theory Center
High-fidelity engineering protocols with built-in PDF transmission capabilities for offline study. Master LLD, HLD, OS, and DBMS through a premium, glassmorphic UI.

---

## 💻 Technical Stack

### Core Engine
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (Document-based pattern storage)
- **Animations**: [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate) & Custom CSS Transitions

### Visual Architecture (The Babua Aesthetic)
- **Glassmorphism**: Premium frosted-glass UI components with high-fidelity blur.
- **Engineering Grid**: Custom SVG grid backgrounds for a focused, technical feel.
- **Typography**: High-Contrast **Bold Italic** hierarchy for primary engineering nodes.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **Package Manager**: npm or yarn
- **Database**: A MongoDB Atlas connection string

### Steps

1. **Clone the Coalition**:
   ```bash
   git clone https://github.com/avesh-pathak/lms.git
   cd lms
   ```

2. **Establish Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Environment**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Initialize Terminal**:
   ```bash
   npm run dev
   ```
   *The Mission Control terminal will now be active at [http://localhost:3000](http://localhost:3000)*

---

## 📖 Usage Examples

### Joining a Neural Coalition (Squad)
To join an elite mentorship group, navigate to the **Squads** tab in the sidebar:
```typescript
// Inside app/dashboard/groups/page.tsx
// Users can browse available coalitions based on their Engineering Goal
const squads = use(MOCK_SQUADS);
return (
  <div className="discovery-hub">
    {squads.map(coalition => <SquadCard node={coalition} />)}
  </div>
);
```

### Booking a Mentor Sync
Select a mentor Lead and establish a temporal node (time-slot) for a deep-dive sync. The system uses a simulated high-fidelity checkout for recurring success.

---

## 🤝 Contributing
We welcome contributions from fellow engineers who share the **Babua Mindset**.

1. **Fork the Terminal**: Create your own copy of the mission parameters.
2. **Branch your Protocol**: `git checkout -b feature/high-fidelity-node`
3. **Commit with Impact**: Use clear, descriptive commit messages.
4. **Push to Sync**: Open a Pull Request for architectural review.

---

## 📜 License
This project is licensed under the **MIT License**. You are free to fork, build, and scale this mission as long as the "Free Core Knowledge" principle is respected.

---

Built with Precision by the **Babua Team** — *Excellence through execution.*
