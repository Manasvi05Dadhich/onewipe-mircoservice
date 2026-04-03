# OneWipe — Blockchain-Backed Certificate Verification Platform

A production-ready **microservices architecture** for issuing, managing, and verifying academic certificates with **blockchain immutability** and **cryptographic signatures**.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    API Gateway (:3000)                  │
│            Rate Limiting • JWT Auth • Routing           │
└──────┬──────┬──────────┬───────────┬──────────────────┘
       │      │          │           │
  ┌────┴──┐ ┌─┴────┐ ┌──┴─────┐ ┌──┴──────────┐
  │ Auth  │ │ Sign │ │  Cert  │ │ Verification │
  │ :3001 │ │ :3002│ │ :3003  │ │    :3004     │
  └───────┘ └──────┘ └──┬─────┘ └──────┬───────┘
                        │              │
                   ┌────┴──────────────┴────┐
                   │   Blockchain Service   │
                   │        :3005           │
                   └────────┬───────────────┘
                            │
                   ┌────────┴───────────┐
                   │  Sepolia Testnet   │
                   │  Smart Contract    │
                   └────────────────────┘

  Infrastructure: Redis (caching) • MongoDB (storage) • Docker
```

---

## Services

| Service | Port | Purpose |
|---|---|---|
| **API Gateway** | 3000 | Rate limiting, JWT verification, request routing |
| **Auth** | 3001 | User registration, login, JWT token generation |
| **Signing** | 3002 | SHA-256 hashing, RSA digital signatures |
| **Certificate** | 3003 | Issue, query, and revoke certificates (MongoDB) |
| **Verification** | 3004 | Cross-validates certificates against DB + blockchain, Redis caching |
| **Blockchain** | 3005 | Smart contract interaction via ethers.js (Sepolia) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas |
| **Blockchain** | Solidity, Ethers.js, Foundry (Sepolia Testnet) |
| **Caching** | Redis |
| **Auth** | JWT, Role-Based Access Control |
| **Cryptography** | SHA-256 hashing, RSA digital signatures |
| **Infrastructure** | Docker, Docker Compose |

---

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Git](https://git-scm.com/) installed

### Run with Docker (one command)

```bash
git clone https://github.com/your-username/onewipe-mircoservice.git
cd onewipe-mircoservice
docker compose up --build
```

All 7 containers start automatically:
```
✅ redis          → Cache layer
✅ auth           → Port 3001
✅ signing        → Port 3002
✅ certificate    → Port 3003
✅ verification   → Port 3004
✅ blockchain     → Port 3005
✅ gateway        → Port 3000
```

### Run without Docker

```bash
# Terminal 1: Start Redis (WSL)
sudo service redis-server start

# Terminal 2-7: Start each service
cd services/auth && npm install && node server.js
cd services/signing && npm install && node server.js
cd services/certificate && npm install && node server.js
cd services/verification && npm install && node server.js
cd services/blockchain && npm install && node server.js
cd gateway && npm install && node server.js
```

---

## API Reference

### Auth
```
POST /auth/register     → Register (email, password, role)
POST /auth/login        → Login → returns JWT token
```

### Certificates (requires JWT + university role)
```
POST   /cert/issue                        → Upload PDF + student info → issue certificate
GET    /cert/certificate/:hash            → Get certificate by hash
GET    /cert/certificates/student/:email  → Get all certificates for a student
PATCH  /cert/certificate/:hash/revoke     → Revoke a certificate
```

### Verification (requires JWT)
```
GET /verify/verify/:hash  → Cross-validate against MongoDB + Blockchain
```

---

## User Roles

| Role | Permissions |
|---|---|
| **University** | Register, Login, Issue certificates, Revoke certificates |
| **Student** | Register, Login, View own certificates |
| **HR/Company** | Login, Verify any certificate by hash |

---

## How It Works

```
1. University uploads PDF certificate
2. Signing Service generates SHA-256 hash + RSA signature
3. Certificate Service saves metadata to MongoDB
4. Blockchain Service stores hash on Sepolia smart contract
5. Anyone can verify: checks BOTH MongoDB + Blockchain
6. If either source says invalid → certificate is invalid
```

---

## Smart Contract

**Network:** Sepolia Testnet  
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
├── gateway/                 # API Gateway (port 3000)
│   ├── routes/              # Proxy routes to microservices
│   ├── middlewar/            # Auth middleware, rate limiting
│   └── config/              # Service URLs configuration
├── services/
│   ├── auth/                # Authentication service (port 3001)
│   ├── signing/             # PDF hashing + RSA signing (port 3002)
│   ├── certificate/         # Certificate CRUD + MongoDB (port 3003)
│   ├── verification/        # Cross-validation + Redis cache (port 3004)
│   └── blockchain/          # Smart contract interaction (port 3005)
├── contracts/               # Solidity smart contracts (Foundry)
├── docker-compose.yml       # One-command orchestration
└── README.md
```

---

## License

MIT
