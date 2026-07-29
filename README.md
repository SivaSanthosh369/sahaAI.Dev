# sahaAI

**AI-Powered Business Automation Platform & Tools Ecosystem**

> Status: 🟡 Active Development — Core CRM + Auth + Client Portals complete, integrations & tools expansion next

---

## What We're Building

sahaAI helps small businesses automate customer engagement, lead capturing, and inquiry management across multiple channels. No technical expertise required. No expensive SaaS subscriptions.

- **Automated Lead & Inquiry Management**: Capture customer requests 24/7 via web widgets, forms, and WhatsApp bots.
- **Client & Admin Dashboards**: Real-time tracking of inquiry statuses (pending, contacted, converted, lost).
- **Developer Ecosystem**: Developers build, deploy, and maintain custom AI tools and integrations, earning recurring income.

**Pricing:** ₹499/month — accessible for small businesses.

---

## Current State

### ✅ Working Now
- Client portal with secure session login
- Admin portal to manage clients & track all inquiries
- Inquiry submission & status workflow management
- Auto-generated unique client IDs (SDC0001 format)
- Express API backend with MySQL pool integration

### 🚧 Building Next
- Client website chatbot widget
- WhatsApp Business API integration (Twilio / Webhooks)
- Booking & workflow automation engine
- Admin authentication & RBAC

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Backend | Express.js, MySQL, express-session, bcrypt |
| Frontend | HTML, Tailwind CSS (vanilla JS) |
| Testing | Postman |
| Deployment | (TBD) |

---

## Project Structure

```
sahaAI/
├── src/
│   ├── config/db.js              # MySQL connection pool
│   ├── routes/
│   │   ├── clients.js            # Client CRUD + login creation
│   │   ├── inquiries.js          # Inquiry submission & status
│   │   └── auth.js               # Login/logout/session
│   ├── utils/idGenerator.js      # SDC0001 format
│   ├── app.js
│   └── server.js
├── views/
│   ├── login-client.html
│   ├── client-dashboard.html
│   ├── admin-portal.html
│   ├── admin-dashboard.html
│   ├── clientform.html
│   └── index.html
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/clients` | Create client + login account |
| GET | `/api/clients` | List all clients |
| POST | `/api/auth/login-client` | Client login |
| GET | `/api/auth/session` | Check active session |
| POST | `/api/auth/logout` | Logout session |
| POST | `/api/inquiries` | Submit inquiry (client) |
| GET | `/api/inquiries` | Client's own inquiries |
| GET | `/api/inquiries/all` | All inquiries (admin) |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status |

---

## Setup

```bash
npm install
# Update src/config/db.js with your MySQL credentials
npm run dev
```

Open `http://localhost:8000` in browser.

---

## The Bigger Picture

Small businesses need simple, affordable automation to capture leads after hours, handle bookings, and track customer inquiries without paying thousands for complex SaaS platforms.

sahaAI provides a low-cost, AI-powered automation platform combining web widgets, WhatsApp channels, and custom business tools powered by a community developer marketplace.

---

## Next Milestones

- [ ] Client website widget
- [ ] WhatsApp webhook integration
- [ ] Workflow & booking engine
- [ ] Admin auth & security

---

**Built for small businesses. Powered by developers. Driven by AI.**
