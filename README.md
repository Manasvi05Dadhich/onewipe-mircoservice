# OneWipe — Blockchain-Backed Certificate Verification Platform

A production-ready **microservices architecture** for issuing, managing, and verifying academic certificates with **blockchain immutability** and **cryptographic signatures**.

---

## Demo

https://github.com/user-attachments/assets/YOUR_VIDEO_ID


**Demo flow:** Register → Login as University → Issue certificate (PDF upload) → Copy hash → Verify on blockchain → Revoke → Re-verify (invalid) → Login as Student → View certs

---

## Architecture

```
                         ┌──────────────────┐
                         │   Frontend (UI)  │
                         │   nginx · :8080  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │      API Gateway (:3000)   │
                    │  Rate Limiting · JWT · CORS│
                    └──┬──────┬─────┬───────┬───┘
                       │      │     │       │
                 ┌─────┴┐ ┌──┴──┐ ┌┴────┐ ┌┴──────────┐
                 │ Auth │ │Sign │ │Cert │ │Verification│
                 │:3001 │ │:3002│ │:3003│ │   :3004    │
                 └──────┘ └─────┘ └──┬──┘ └─────┬──────┘
                                     │          │
                               ┌─────┴──────────┴─────┐
                               │  Blockchain Service   │
                               │       :3005           │
                               └───────────┬───────────┘
                                           │
                                  ┌────────┴────────┐
                                  │ Sepolia Testnet  │
                                  │ Smart Contract   │
                                  └─────────────────┘

         Infrastructure: Redis (caching) · MongoDB Atlas · Docker
```

---

## Services

| Service | Port | Purpose |
|---|---|---|
| **Frontend** | 8080 | Glassmorphism UI served by nginx |
| **API Gateway** | 3000 | Rate limiting, JWT verification, CORS, request routing |
| **Auth** | 3001 | User registration, login, JWT token generation |
| **Signing** | 3002 | SHA-256 hashing, RSA digital signatures |
| **Certificate** | 3003 | Issue, query, and revoke certificates (MongoDB) |
| **Verification** | 3004 | Cross-validates certificates against DB + blockchain, Redis caching |
| **Blockchain** | 3005 | Smart contract interaction via ethers.js (Sepolia) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS (Glassmorphism), Vanilla JS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas |
| **Blockchain** | Solidity, Ethers.js, Foundry (Sepolia Testnet) |
| **Caching** | Redis |
| **Auth** | JWT, Role-Based Access Control |
| **Cryptography** | SHA-256 hashing, RSA digital signatures |
| **Infrastructure** | Docker, Docker Compose, nginx |

---

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Git](https://git-scm.com/) installed

### Run (one command)

```bash
git clone https://github.com/Manasvi05Dadhich/onewipe-mircoservice.git
cd onewipe-mircoservice
docker compose up --build
```

All 8 containers start automatically:
```
✅ redis          → Cache layer
✅ auth           → Port 3001
✅ signing        → Port 3002
✅ certificate    → Port 3003
✅ verification   → Port 3004
✅ blockchain     → Port 3005
✅ gateway        → Port 3000
✅ frontend       → Port 8080  ← Open this!
```

Then open **http://localhost:8080**

---

## User Roles

| Role | What they can do |
|---|---|
| 🏛️ **University** | Register, Login, Upload PDF → Issue certificate, View dashboard, Revoke certificates |
| 🎓 **Student** | Register, Login, View their certificates, Copy hash to share |
| 🏢 **HR / Company** | Register, Login, Verify any certificate by hash |

---

## How It Works

```
1. University uploads PDF certificate
2. Signing Service generates SHA-256 hash + RSA digital signature
3. Certificate Service saves metadata to MongoDB
4. Blockchain Service stores hash on Sepolia smart contract
5. Anyone can verify: cross-checks BOTH MongoDB + Blockchain
6. If either source says invalid → certificate is invalid
7. Results are cached in Redis (5 min TTL) for performance
```

---

## API Reference

### Auth
```http
POST /auth/signup      →  Register { email, password, role }
POST /auth/login       →  Login    { email, password } → { token }
GET  /auth/verify      →  Validate JWT token
```

### Certificates (JWT + university role required)
```http
POST   /cert/issue                        →  Upload PDF + student info → issue cert
GET    /cert/certificate/:hash            →  Get certificate by hash
GET    /cert/certificates/student/:email  →  Get all certs for a student
GET    /cert/certificates/issued          →  Get all certs issued by current user
PATCH  /cert/certificate/:hash/revoke     →  Revoke a certificate
```

### Verification (JWT required)
```http
GET /verify/verify/:hash  →  Cross-validate against MongoDB + Blockchain
```

---

## Smart Contract

**Network:** Ethereum Sepolia Testnet  
**Contract:** `CertificateRegistry`

```solidity
function issueCert(bytes32 hash)          // Store certificate hash (issuer only)
function verifyCertificate(bytes32 hash)  // Check if certificate exists (public)
function revokeCertificate(bytes32 hash)  // Revoke a certificate (issuer only)
```

---

## Project Structure

```
onewipe-mircoservice/
├── frontend/                # UI (nginx + static HTML)
│   ├── index.html           # Single-page app
│   └── Dockerfile           # nginx:alpine
├── gateway/                 # API Gateway (port 3000)
│   ├── routes/              # Proxy routes to microservices
│   ├── middlewar/            # Auth middleware, rate limiting
│   └── config/              # Service URLs configuration
├── services/
│   ├── auth/                # Authentication (port 3001)
│   ├── signing/             # PDF hashing + RSA (port 3002)
│   ├── certificate/         # Certificate CRUD (port 3003)
│   ├── verification/        # Cross-validation + cache (port 3004)
│   └── blockchain/          # Smart contract (port 3005)
├── contracts/               # Solidity (Foundry)
├── docker-compose.yml       # One-command orchestration
└── README.md
```

---

## Environment Variables

Each service uses these env vars (configured in `docker-compose.yml`):

| Variable | Used by | Description |
|---|---|---|
| `JWT_SECRET` | Auth, Cert, Verification, Gateway | Shared secret for JWT signing |
| `MONGO_URI` | Auth, Certificate | MongoDB Atlas connection string |
| `REDIS_URL` | Verification | Redis connection string |
| `RPC_URL` | Blockchain | Ethereum Sepolia RPC endpoint |
| `PRIVATE_KEY` | Blockchain | Wallet key for contract calls |
| `CONTRACT_ADDRESS` | Blockchain | Deployed smart contract address |

---

## License

MIT
