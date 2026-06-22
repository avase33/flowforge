<div align="center">

```
 ___ _              ___ ___ ___ ___
| __| |_____ __ __|  _/ _ \| _ \ __|
| _|| / _ \ V  V /| || (_) |   / _|
|_| |_\___/\_/\_/ |_| \___/|_|_\___|
```

### **Visual Workflow Automation Builder**

*Drag-and-drop pipelines. Webhooks. 50+ integrations. Ship automations in minutes.*

<br/>

[![CI](https://github.com/avase33/flowforge/actions/workflows/ci.yml/badge.svg)](https://github.com/avase33/flowforge/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-Proprietary-red)

<br/>

> **FlowForge** is a developer-first workflow automation platform. Build pipelines visually with a drag-and-drop canvas, connect to any API via webhooks, and trigger automations from Slack, GitHub, Stripe, or any HTTP source. Deploy in one command.

</div>

---

## The Problem

Manual processes kill velocity. Zapier is too expensive and too limited for engineering teams. Custom scripts are one-off and fragile. FlowForge gives you the visual builder of no-code tools with the power and extensibility of code.

---

## Feature Highlights

### Visual Pipeline Builder

- Drag-and-drop node canvas powered by React Flow
- 50+ built-in trigger and action nodes
- Conditional branching: if/else, switch, filter
- Loop nodes: for-each, map, reduce over arrays
- Real-time execution preview with live data at each node

### Trigger Sources

- HTTP webhooks: any POST endpoint becomes a trigger
- Cron schedule: run workflows on a time-based schedule
- GitHub: push, PR open, issue created, deployment
- Slack: message received, slash command, reaction
- Stripe: payment succeeded, subscription updated

### Action Nodes

- HTTP Request: call any REST API with custom headers, auth
- Send Email: SendGrid, SMTP
- Database: query or insert into PostgreSQL or MongoDB
- Transform: JavaScript eval node for custom logic
- Notify: Slack message, email, webhook

### Execution Engine

- Workflows run in isolated worker processes (no cross-contamination)
- Full execution history with input/output at every node
- Retry logic: configurable backoff on failure
- Dead letter queue: failed executions captured for replay

---

## Architecture

```
+--------------------------------------------------------------+
|                      CLIENT (Browser)                        |
|  React 18 + React Flow -- Drag-and-drop Pipeline Canvas     |
+------------------------+-------------------------------------+
                         |
                         |  REST API + WebSocket (live logs)
                         |
+------------------------v-------------------------------------+
|                    API SERVER (Node.js 20)                   |
|  Express 4 - TypeScript - ES Modules                         |
|                                                              |
|  +-----------+  +----------+  +----------+  +----------+   |
|  |  Workflow |  | Trigger  |  |Execution |  | Webhook  |   |
|  |   Store   |  | Manager  |  | Engine   |  | Router   |   |
|  +-----------+  +----------+  +----------+  +----------+   |
+------------------------+-------------------------------------+
                         |
       +-----------------+------------------+
       |                                    |
+------v------+                   +---------v--------+
|  PostgreSQL |                   |   Worker Pool    |
| (workflows, |                   | (Node child_proc)|
|  executions)|                   | isolated runners |
+-------------+                   +------------------+
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 20, TypeScript | API server and execution engine |
| **Framework** | Express 4 | REST API routing |
| **Database** | PostgreSQL 16, Prisma | Workflow and execution storage |
| **Queue** | Bull + Redis | Execution job queue |
| **Frontend** | React 18, React Flow | Visual pipeline canvas |
| **Styling** | Tailwind CSS | Clean, responsive UI |
| **Realtime** | WebSocket | Live execution log streaming |
| **Auth** | JWT + OAuth | User auth + integration OAuth flows |
| **CI** | GitHub Actions | Build, test, lint on push |

---

## Quick Start

### Option A: Docker

```bash
git clone https://github.com/avase33/flowforge.git
cd flowforge
cp .env.example .env
docker compose up -d
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://localhost:5000/api |
| Redis | localhost:6379 |
| PostgreSQL | localhost:5432 |

### Option B: Local Development

**Backend**

```bash
cd backend
npm install
cp ../.env.example .env
npx prisma migrate dev
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Built-in Nodes

| Category | Nodes |
|---|---|
| **Triggers** | Webhook, Cron, GitHub, Slack, Stripe, HTTP Poll |
| **Logic** | If/Else, Switch, Filter, Loop, Merge, Delay |
| **Actions** | HTTP Request, Send Email, Slack Message, Database Query |
| **Transform** | JSON Parse, Map, Filter, Reduce, JavaScript Eval |
| **Output** | Log, Webhook Response, Store Variable |

---

## Roadmap

- [ ] Visual debugger: step through executions node by node
- [ ] Workflow versioning and rollback
- [ ] Team workspaces with role-based access
- [ ] Marketplace: share and install community workflows
- [ ] AI node: prompt any LLM and use the response downstream
- [ ] Mobile app for monitoring and manual triggers
- [ ] SOC 2 compliance mode for enterprise

---

## License

```
Copyright (c) 2026 Akhil Vase. All rights reserved.

This source code is the proprietary property of Akhil Vase.
Unauthorized copying, distribution, or modification is strictly prohibited.
```

---

<div align="center">

**Automate anything. Ship in minutes.**

*FlowForge -- Where workflows are built, not written.*

</div>
