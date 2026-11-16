# CaterSmart AI 🍽️🤖

> **Intelligent Catering Operations & Food Waste Optimization**  
> *Smarter Guest Predictions. Less Food Waste.*

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-black?logo=vercel)](https://catersmart-ai.vercel.app)
[![GitHub License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 Overview

**CaterSmart AI** is an intelligent catering operations suite engineered to reduce commercial kitchen food waste while optimizing margins. By leveraging machine learning models, historical guest behavior, weather telemetry, and real-time RSVP updates, CaterSmart AI delivers accurate turnout forecasts, dynamic ingredient buffer planning, automated human-in-the-loop surplus food rescue distribution to verified NGOs, and RAG-powered operational intelligence.

---

## ✨ Key Features

- **Guest Turnout Predictor**: Predict attendance distributions and calculate dynamic ingredient buffer recommendations.
- **Financial & Impact Analytics**: Real-time modeling of ingredient cost savings, food salvage metrics, and environmental impact.
- **NGO Surplus Food Rescue**: Automated discovery, safety verification, and dispatch coordination with certified local non-profits.
- **Operational RAG Knowledge Assistant**: Instant lookup and citation across catering guidelines, food safety protocols, and operational manuals.
- **Agent Tool Connections (Simulated MCP)**: Architectural integration simulating autonomous tool execution, telemetry, and decision provenance.
- **Dark / Light Mode**: Adaptive theme support respecting system preferences.

---

## 🚀 Live Demo

Experience the live application hosted on Vercel:  
👉 **[catersmart-ai.vercel.app](https://catersmart-ai.vercel.app)** *(or active deployment)*

---

## 💻 Local Development

Simply serve the directory with any static HTTP server or open directly in your browser:

```bash
# Using Node.js http-server / serve
npx serve .

# Or using Python
python -m http.server 3000
```

Navigate to `http://localhost:3000` in your web browser.

---

## 🛡️ Playwright Verification Protocol

This project adheres to the mandatory 6-stage Playwright verification pipeline:
1. **Boot & Scaffolding**: Valid DOCTYPE, responsive meta tags, zero console errors.
2. **Layout & Asset Integrity**: Landmark checks, valid image loads, CSS font integration.
3. **Interactivity & State Management**: Interactive controls, scenario switches, and event handlers.
4. **Responsive Testing**: Verified across Mobile (375x667), Tablet (768x1024), and Desktop (1280x800) viewports without horizontal overflow.
5. **Accessibility Standards**: Semantic HTML, heading hierarchy, and accessible interactive roles.
6. **End-to-End User Journeys**: Full workflow simulation from scenario selection to NGO dispatch.
