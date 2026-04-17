# ⚔️ AI Battle Arena

AI Battle Arena is a sophisticated full-stack platform where top-tier Large Language Models (LLMs) compete to solve user problems. The platform leverages **Mistral** and **Cohere** as combatants, while **Google's Gemini** acts as the ultimate judge, providing scores and detailed reasoning for each solution.

## 🚀 Features

*   **Multi-Model Competitions:** Watch Mistral AI and Cohere compete side-by-side to solve your technical or creative problems.
*   **AI Judging:** Solutions are evaluated by Gemini-1.5-Flash based on accuracy, reasoning, and context.
*   **LangGraph Orchestration:** The "battle" logic is managed using a robust StateGraph for reliable multi-turn AI interactions.
*   **Google OAuth Integration:** Secure and seamless authentication using Google accounts.
*   **Modern Responsive UI:** Built with React and Tailwind CSS for a premium, fast-loading experience.
*   **Persistent Conversations:** User history and battle results are stored in MongoDB.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API
- **Routing:** React Router 7
- **Authentication:** @react-oauth/google

### Backend
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **AI Orchestration:** LangChain & LangGraph
- **Authentication:** JWT (JSON Web Tokens) & Cookie-Parser

### AI Models Used
- **Judge:** Gemini-1.5-Flash (Google)
- **Combatant 1:** Mistral-Medium (Mistral AI)
- **Combatant 2:** Command-A (Cohere)

## 📋 Prerequisites

Before you begin, ensure you have the following:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) account and URI
- API Keys for:
  - [Google AI Studio](https://aistudio.google.com/)
  - [Mistral AI Console](https://console.mistral.ai/)
  - [Cohere Dashboard](https://dashboard.cohere.com/)
- [Google Cloud Console](https://console.cloud.google.com/) project for OAuth credentials

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AI-Battle-Arena
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```bash
   # Root .env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   COHERE_API_KEY=your_cohere_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## 🏃 Running the Project

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build

```bash
# Build Backend
cd backend
npm run build

# Build Frontend
cd ../frontend
npm run build
```

## 📁 Project Structure

```text
AI-Battle-Arena/
├── backend/            # Express + TypeScript server
│   ├── src/
│   │   ├── ai/         # LangGraph & LangChain Logic
│   │   ├── controllers/# Route Handlers
│   │   ├── models/     # Mongoose Schemas
│   │   ├── routes/     # API Endpoints
│   │   └── config/     # DB & Env Configurations
│   └── tsconfig.json
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── pages/      # View Components
│   │   ├── context/    # Auth & State Contexts
│   │   └── services/   # API Call Logic
│   └── vite.config.js
├── .env.example        # Reference for secrets
└── README.md
```

## 📜 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

Built with ❤️ by [Your Name/Github Username]
