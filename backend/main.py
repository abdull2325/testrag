import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from rag import chunk_text, embed_texts, build_vector_store, search
from db import init_db, save_message, get_conversation
from admin_settings import load_settings, save_settings

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str


@app.on_event("startup")
def startup():
    """Initialize DB and build vector store from article if available."""
    init_db()
    app.state.store = None
    
    # Try to load article from various paths
    candidates = [
        "./data/article.txt",
        "../data/article.txt",
        os.path.join(os.path.dirname(__file__), "..", "data", "article.txt"),
    ]
    
    for p in candidates:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                text = f.read()
            if text.strip() and not text.strip().startswith("<!--"):
                print(f"Loading knowledge base from {p}")
                chunks = chunk_text(text)
                try:
                    embeddings = embed_texts(chunks)
                    app.state.store = build_vector_store(chunks, embeddings)
                    print(f"Vector store built with {len(chunks)} chunks")
                except Exception as e:
                    print(f"Error building vector store: {e}")
                    app.state.store = None
            break


@app.post("/chat")
def chat(req: ChatRequest):
    """
    Handle chat messages with RAG and human escalation logic.
    """
    msg = req.message or ""
    conv = req.conversation_id or "default"

    # Human escalation rule
    lowered = msg.lower()
    if "refund" in lowered or "money back" in lowered:
        save_message(conv, "user", msg)
        return {"message": "", "needs_human": True, "conversation_id": conv}

    save_message(conv, "user", msg)

    settings = load_settings()

    # If we have a vector store, run similarity search
    if app.state.store:
        try:
            results = search(msg, app.state.store, top_k=3)
            top_score = results[0][1] if results else 0.0
        except Exception as e:
            print(f"Search error: {e}")
            results = []
            top_score = 0.0
    else:
        results = []
        top_score = 0.0

    # Check if this is a follow-up question (references previous conversation)
    conversation_history = get_conversation(conv)
    is_followup = False
    followup_keywords = ["acum", "now", "în", "in", "te rog", "please", "poți", "can you", "spune-mi", "tell me"]
    if conversation_history and len(conversation_history) > 0:
        # If message is short and contains follow-up keywords, treat as follow-up
        if len(msg.split()) < 10 and any(keyword in msg.lower() for keyword in followup_keywords):
            is_followup = True

    # Low similarity fallback (but skip if it's a follow-up question)
    SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.65"))
    if top_score < SIMILARITY_THRESHOLD and not is_followup:
        reply = settings.get("fallbackMessage") or settings.get("fallback_message") or "Ne pare rău, nu am găsit un răspuns adecvat."
        save_message(conv, "assistant", reply)
        return {"message": reply, "needs_human": False, "conversation_id": conv}

    # Build prompt for OpenAI
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set on server")
    
    client = OpenAI(api_key=key)

    tone = settings.get("toneInstructions") or settings.get("tone_instructions", "Răspunde într-un ton prietenos și profesional, în limba română.")
    context = "\n\n---\nRelevant documentation:\n"
    for chunk, score in results:
        context += f"\n{chunk}\n"

    system_prompt = (
        f"You are a helpful assistant. {tone}\n"
        f"Use the provided relevant documentation to answer the user's question accurately.\n"
        f"If the user asks you to translate or repeat information in a different language, do so based on the conversation history."
    )

    # Get conversation history for context (already fetched above)
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add last 3 exchanges for context (if any)
    if conversation_history:
        recent_messages = conversation_history[-6:]  # Last 3 exchanges (user + assistant)
        for hist_msg in recent_messages:
            messages.append({
                "role": "user" if hist_msg["sender"] == "user" else "assistant",
                "content": hist_msg["message"]
            })
    
    # Add current query with context
    user_prompt = f"{context}\n\nUser question: {msg}"
    messages.append({"role": "user", "content": user_prompt})

    try:
        resp = client.chat.completions.create(
            model=os.getenv("OPENAI_CHAT_MODEL", "gpt-3.5-turbo"),
            messages=messages,
            max_tokens=512,
            temperature=0.2,
        )
        assistant_text = resp.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI error: {e}")
        assistant_text = settings.get("fallbackMessage") or "Ne pare rău, a apărut o eroare."
    
    save_message(conv, "assistant", assistant_text)
    return {"message": assistant_text, "needs_human": False, "conversation_id": conv}


@app.get("/conversation/{conversation_id}")
def get_conv(conversation_id: str):
    """Retrieve conversation history."""
    messages = get_conversation(conversation_id)
    return {"conversation_id": conversation_id, "messages": messages}


@app.get("/admin/settings")
def get_settings():
    """Get admin settings."""
    return load_settings()


@app.post("/admin/settings")
def post_settings(payload: dict):
    """Update admin settings."""
    save_settings(payload)
    return {"ok": True}


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "vector_store_loaded": app.state.store is not None,
    }
