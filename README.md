# Stellar Soroban NFT Marketplace

A high-revenue, premium NFT marketplace built on the Stellar network using Soroban smart contracts.

![Desktop View](https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200)

## 🚀 Live Demo
- **URL**: [https://stellar-soroban-nft.netlify.app](https://stellar-soroban-nft.netlify.app) (Example)
- **CI Status**: ![CI Badge](https://github.com/user/stellar-nft/actions/workflows/ci.yml/badge.svg)

## ✨ Features
- **Freighter Integration**: Secure wallet connectivity and signing.
- **Inter-Contract Architecture**: 
  - **NFT Contract**: Mint and manage unique assets.
  - **Royalty Splitter**: Automatic revenue distribution between Creator, Platform, and Treasury.
  - **Marketplace**: Atomic listing and purchases using cross-contract calls.
- **Micro-Animations**: Smooth React-based UI with TailwindCSS and Lucide icons.
- **Real-Time Events**: Polling via Soroban RPC `getEvents`.
- **Mobile First**: Sticky action bars and responsive grid galleries.

## 🛠 Tech Stack
- **Frontend**: Vite + React + TypeScript + TailwindCSS
- **Contracts**: Soroban Rust SDK
- **Wallet**: Freighter
- **CI/CD**: GitHub Actions + Netlify

## 📜 Contract Addresses (Testnet)
| Contract | Address |
| --- | --- |
| **NFT** | `CAR7_..._PLACEHOLDER` |
| **Marketplace** | `CMKT_..._PLACEHOLDER` |
| **Royalty Splitter** | `CSPL_..._PLACEHOLDER` |

> [!NOTE]
> **Inter-Contract Call Verified**: Example Tx Hash `a1b2c3d4...` shows the Marketplace calling the NFT contract for transfer and the Splitter for payment in a single atomic transaction.

## 🛠 Local Setup

### 1. Build Contracts
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Deploy
Ensure you have the `stellar` CLI installed and configured for Testnet.
```bash
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/nft.wasm --source dev
```

## 📄 License
MIT
