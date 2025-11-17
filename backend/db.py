import sqlite3
import threading
from typing import List, Dict, Any
import time

DB_PATH = "./conversations.db"
_lock = threading.Lock()


def init_db():
    """Initialize the SQLite database."""
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT,
            sender TEXT,
            message TEXT,
            timestamp REAL
        )
        """
        )
        conn.commit()
        conn.close()


def save_message(conversation_id: str, sender: str, message: str):
    """Save a message to the conversation history."""
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO messages (conversation_id, sender, message, timestamp) VALUES (?, ?, ?, ?)",
            (conversation_id, sender, message, time.time()),
        )
        conn.commit()
        conn.close()


def get_conversation(conversation_id: str) -> List[Dict[str, Any]]:
    """Retrieve all messages for a conversation."""
    with _lock:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(
            "SELECT sender, message, timestamp FROM messages WHERE conversation_id = ? ORDER BY id ASC",
            (conversation_id,),
        )
        rows = cur.fetchall()
        conn.close()
    return [{"sender": r[0], "message": r[1], "timestamp": r[2]} for r in rows]
