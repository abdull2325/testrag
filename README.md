# RAG-Powered AI Chatbot System

A professional full-stack AI chatbot system built with FastAPI (backend), React + TypeScript (frontend), featuring RAG (Retrieval Augmented Generation) using OpenAI embeddings and GPT, admin panel, and human takeover logic.

## 📋 Project Structure

```
testrag/
├── backend/                    # FastAPI backend with RAG
│   ├── main.py                # Main API endpoints
│   ├── rag.py                 # RAG implementation (chunking, embedding, search)
│   ├── db.py                  # SQLite conversation storage
│   ├── admin_settings.py      # Admin settings management
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (API keys)
│
├── AI Chatbot System/         # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── ChatWidget.tsx     # Chat interface
│   │   │   ├── AdminPanel.tsx     # Admin settings panel
│   │   │   └── AdminLogin.tsx     # Admin authentication
│   │   ├── lib/
│   │   │   └── backend.ts     # API client
│   │   └── App.tsx            # Main app component
│   ├── package.json
│   └── .env                   # Frontend config (API URL)
│
├── data/
│   └── article.txt            # Knowledge base (IPTV article)
│
├── admin/                     # (Integrated in main frontend)
├── chat-ui/                   # (Integrated in main frontend)
└── README.md                  # This file
```

## ✨ Features

### 🤖 RAG-Powered Chat
- ✅ Vector similarity search using OpenAI embeddings
- ✅ Context-aware responses using GPT-3.5-turbo
- ✅ Romanian-friendly tone
- ✅ Conversation history storage (SQLite)
- ✅ Real-time chat interface

### 🛡️ Human Escalation
- ✅ Automatic detection of keywords ("refund", "money back")
- ✅ Stops AI and notifies user: "AI a oprit. Un coleg va prelua conversația."

### ⚙️ Admin Panel
- ✅ Configure welcome message
- ✅ Set fallback message for low-similarity queries
- ✅ Customize tone instructions
- ✅ Real-time settings updates
- ✅ Settings persistence (JSON + localStorage)

### 🎨 Beautiful UI
- ✅ Modern gradient design with animations
- ✅ Responsive chat widget
- ✅ Admin dashboard with authentication
- ✅ Real-time message display

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API key

### 1. Clone & Setup

```bash
cd /Users/abdullahrauf/python/testrag
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Your API key is already in .env file
# Start the server
python -m uvicorn main:app --reload --port 8000
```

Backend will run at: **http://localhost:8000**

### 3. Frontend Setup

Open a new terminal:

```bash
cd "/Users/abdullahrauf/python/testrag/AI Chatbot System"

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

## 📡 API Endpoints

### Chat Endpoints

#### POST /chat
Send a message and get AI response with RAG.

**Request:**
```json
{
  "message": "What is IPTV?",
  "conversation_id": "conv_123"
}
```

**Response:**
```json
{
  "message": "IPTV (Internet Protocol Television) este...",
  "needs_human": false,
  "conversation_id": "conv_123"
}
```

**Human Escalation Response:**
```json
{
  "message": "",
  "needs_human": true,
  "conversation_id": "conv_123"
}
```

#### GET /conversation/{id}
Retrieve conversation history.

**Response:**
```json
{
  "conversation_id": "conv_123",
  "messages": [
    {
      "sender": "user",
      "message": "What is IPTV?",
      "timestamp": 1700000000.0
    },
    {
      "sender": "assistant",
      "message": "IPTV este...",
      "timestamp": 1700000001.0
    }
  ]
}
```

### Admin Endpoints

#### GET /admin/settings
Get current admin settings.

**Response:**
```json
{
  "welcomeMessage": "Bună! Cu ce te pot ajuta?",
  "fallbackMessage": "Ne pare rău, nu am găsit un răspuns adecvat...",
  "toneInstructions": "Respond in a friendly, Romanian-friendly tone."
}
```

#### POST /admin/settings
Update admin settings.

**Request:**
```json
{
  "welcomeMessage": "Hello! How can I help?",
  "fallbackMessage": "Sorry, I don't have information about that.",
  "toneInstructions": "Be professional and helpful."
}
```

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_key_here

# Model Configuration (optional)
OPENAI_EMBED_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo

# RAG Configuration (optional)
SIMILARITY_THRESHOLD=0.65
```

### Frontend Environment Variables

Edit `AI Chatbot System/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## 📚 Knowledge Base

The knowledge base article is located at `/data/article.txt` and contains information about IPTV (Internet Protocol Television) from Simple Wikipedia.

To update the knowledge base:
1. Edit `/data/article.txt`
2. Restart the backend server
3. The RAG system will automatically re-index the content

## 🧪 Testing

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:8000/

# Test chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is IPTV?","conversation_id":"test1"}'

# Test human escalation
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I want a refund","conversation_id":"test2"}'

# Get conversation
curl http://localhost:8000/conversation/test1

# Get settings
curl http://localhost:8000/admin/settings
```

### Test Frontend

1. Open http://localhost:3000
2. Test the chat widget:
   - Ask: "What is IPTV?"
   - Try human escalation: "I want a refund"
3. Navigate to Admin Panel:
   - Click "Admin Panel" in navigation
   - Login (any credentials work for demo)
   - Update settings
   - Return to chat and see changes

## 🎯 Key Features Demonstrated

### RAG Implementation
- ✅ Text chunking with overlap
- ✅ OpenAI embeddings (text-embedding-3-small)
- ✅ Cosine similarity search
- ✅ Context injection into GPT prompts
- ✅ Fallback for low-similarity queries

### Human Takeover Logic
- ✅ Keyword detection ("refund", "money back")
- ✅ Stops AI processing
- ✅ Returns `needs_human: true`
- ✅ Frontend displays escalation message

### Admin Panel
- ✅ Settings CRUD operations
- ✅ Real-time updates
- ✅ Persistent storage (JSON + localStorage)
- ✅ Authentication system

### Conversation Management
- ✅ SQLite storage
- ✅ Message history retrieval
- ✅ Conversation ID tracking

## 🔐 Security Notes

- ⚠️ **Never commit `.env` files to Git**
- ⚠️ The API key is in `.env` for development only
- ⚠️ In production, use environment variables or secrets management
- ⚠️ The admin login is simplified for demo purposes

## 📝 Development Notes

### Backend
- FastAPI with auto-reload enabled
- CORS configured for frontend integration
- SQLite for simple conversation storage
- OpenAI API client v1.0+ compatible

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS v3 for styling
- shadcn/ui components

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python3 --version` (need 3.9+)
- Verify virtual environment is activated
- Check if port 8000 is available

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### RAG not working
- Verify `data/article.txt` has content
- Check OpenAI API key in `backend/.env`
- Look at backend console for errors

### CORS errors
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS middleware is enabled in `backend/main.py`

## 📊 API Documentation

When backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🎥 Demo Video

Create a 1-2 minute demo video showing:
1. Chat functionality with IPTV questions
2. Human escalation with "refund" keyword
3. Admin panel settings update
4. Settings reflection in chat

## ⚡ Performance

- Backend startup: ~1-2 seconds
- Vector store build: ~1 second (for small article)
- Chat response time: ~1-3 seconds (depends on OpenAI API)
- Frontend hot reload: <200ms

## 🚧 Future Enhancements

- [ ] User authentication
- [ ] Multiple knowledge bases
- [ ] Advanced RAG strategies (re-ranking, hybrid search)
- [ ] Analytics dashboard
- [ ] Export conversations
- [ ] Multi-language support
- [ ] Docker containerization
- [ ] Production deployment guide

## 📄 License

This is a test project for evaluation purposes.

## 🤝 Support

For issues or questions about this implementation, please refer to:
- Backend logs: Check terminal running uvicorn
- Frontend console: Check browser developer tools
- API docs: http://localhost:8000/docs

---

**Built with ❤️ using FastAPI, React, OpenAI, and modern web technologies**
