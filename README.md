# Node.js Design Patterns - Exercise Solutions

A comprehensive collection of my solutions to the exercises presented in [_Node.js Design Patterns_](https://www.nodejsdesignpatterns.com/) (4th Edition) by Mario Casciaro and Luciano Mammino.

This repository serves as a practical application of advanced backend engineering concepts, including asynchronous control flow, Node.js streams (memory management and backpressure), architectural design patterns, and message-driven systems.

## 🧠 Methodology & Solution Quality

Because the original authors of _Node.js Design Patterns_ do not provide official solutions to the end-of-chapter exercises, I take a rigorous approach to ensure the quality of the code in this repository:

- **Strict Concept Alignment:** I heavily scrutinize my own solutions to ensure they strictly adhere to the specific architectural paradigms, memory constraints, and event-driven concepts introduced in that chapter.
- **Optimization & Peer Comparison:** To guarantee the most optimal outcome, I cross-reference my implementations with industry best practices and community discussions. My goal is never just to write code that passes, but to write production-ready, performant, and memory-safe systems.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher recommended)
- npm

## 💻 Running the Exercises

This repository is configured with a unified script runner. You can execute any specific exercise by passing its chapter and exercise number directly to the `npm run` command.

**Syntax:**

```bash
npm run <chapter>.<exercise>
```

**Examples:**

```bash
npm run 3.1   # Runs Chapter 3, Exercise 1 (A simple EventEmitter)
npm run 4.2   # Runs Chapter 4, Exercise 2 (List files recursively with callbacks)
npm run 6.1   # Runs Chapter 6, Exercise 1 (Data compression/processing with Streams)
```

## 📂 Repository Structure & Concepts Covered

The exercises are structured by chapter, mapping directly to the core systems engineering concepts taught in the book:

- **Chapters 3-5: Asynchronous Control Flow**
  Mastering the Event Loop, avoiding callback hell, managing unhandled promise rejections, and building custom concurrency-limited Task Queues.

- **Chapter 6: Coding with Streams**
  Handling massive datasets using `fs` streams, Transform streams, and `pipeline()` to process data without exceeding V8 memory limits.

- **Chapters 7-9: Design Patterns**
  Implementing Creational (Factory, Builder), Structural (Proxy, Decorator), and Behavioral (Middleware, Command, Strategy) patterns natively in Node.js.

- **Chapters 10-13: Advanced Architecture & Scalability**
  Writing robust tests, offloading CPU-bound tasks to Worker Threads, and integrating message brokers (Redis/ZeroMQ).
