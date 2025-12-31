import { MongoDBProblem } from "@/lib/types"

export const DOMAIN_PROBLEMS: MongoDBProblem[] = [
    // System Design
    {
        _id: "sd-1",
        title: "Design a Scalable URL Shortener",
        problem_link: "https://system-design.com/url-shortener",
        topic: "Scalability",
        difficulty: "Medium",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "System Design"
    },
    {
        _id: "sd-2",
        title: "Design a Notification Service",
        problem_link: "https://system-design.com/notification-service",
        topic: "Message Queues",
        difficulty: "Hard",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "System Design"
    },
    {
        _id: "sd-3",
        title: "CAP Theorem & PACELC",
        problem_link: "https://system-design.com/cap-theorem",
        topic: "Distributed Systems",
        difficulty: "Easy",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "System Design"
    },
    {
        _id: "sd-4",
        title: "Design a Rate Limiter",
        problem_link: "https://system-design.com/rate-limiter",
        topic: "API Design",
        difficulty: "Medium",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "System Design"
    },

    // LLD (Low Level Design)
    {
        _id: "lld-1",
        title: "Design a Parking Lot System",
        problem_link: "https://lld.com/parking-lot",
        topic: "OOD Patterns",
        difficulty: "Medium",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "LLD"
    },
    {
        _id: "lld-2",
        title: "Implement a Lisp Interpreter",
        problem_link: "https://lld.com/interpreter",
        topic: "Design Patterns",
        difficulty: "Hard",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "LLD"
    },
    {
        _id: "lld-3",
        title: "Factory Pattern Implementation",
        problem_link: "https://lld.com/factory-pattern",
        topic: "Creational Patterns",
        difficulty: "Easy",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "LLD"
    },

    // Core Engineering
    {
        _id: "core-1",
        title: "Explain the TCP 3-Way Handshake",
        problem_link: "https://core.com/tcp-handshake",
        topic: "Computer Networks",
        difficulty: "Easy",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "Core Engineering"
    },
    {
        _id: "core-2",
        title: "B+ Trees vs Hash Indexes",
        problem_link: "https://core.com/db-indexes",
        topic: "DBMS",
        difficulty: "Medium",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "Core Engineering"
    },
    {
        _id: "core-3",
        title: "Process vs Thread",
        problem_link: "https://core.com/os-process",
        topic: "Operating Systems",
        difficulty: "Easy",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "Core Engineering"
    },
    {
        _id: "core-4",
        title: "ACID Properties in Databases",
        problem_link: "https://core.com/acid",
        topic: "DBMS",
        difficulty: "Medium",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "Core Engineering"
    },

    // AI/ML
    {
        _id: "ai-1",
        title: "Explain Backpropagation Algorithm",
        problem_link: "https://aiml.com/backprop",
        topic: "Neural Networks",
        difficulty: "Hard",
        status: "Pending",
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "AI/ML"
    },
    {
        _id: "ai-2",
        title: "Linear Regression from Scratch",
        problem_link: "https://aiml.com/linear-regression",
        topic: "Supervised Learning",
        difficulty: "Medium",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "AI/ML"
    },
    {
        _id: "ai-3",
        title: "What is an LLM?",
        problem_link: "https://aiml.com/intro-llm",
        topic: "GenAI",
        difficulty: "Easy",
        status: "Pending",
        starred: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        domain: "AI/ML"
    }
]
