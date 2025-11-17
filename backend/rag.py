import os
import math
from typing import List, Tuple
import numpy as np
from openai import OpenAI

EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")

# Initialize OpenAI client
def get_client():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    return OpenAI(api_key=key)


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i : i + chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks


def embed_texts(texts: List[str]) -> List[np.ndarray]:
    """Embed a list of text chunks using OpenAI embeddings."""
    client = get_client()
    resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
    embeddings = [np.array(item.embedding) for item in resp.data]
    return embeddings


def build_vector_store(chunks: List[str], embeddings: List[np.ndarray]):
    """Build a simple vector store from chunks and embeddings."""
    matrix = np.vstack(embeddings)
    return {"chunks": chunks, "embeddings": matrix}


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


def search(query: str, store, top_k: int = 3) -> List[Tuple[str, float]]:
    """Search for the most relevant chunks given a query."""
    client = get_client()
    
    # Embed the query
    resp = client.embeddings.create(model=EMBED_MODEL, input=[query])
    q_emb = np.array(resp.data[0].embedding).reshape(1, -1)[0]
    
    # Calculate similarities
    sims = []
    for idx, emb in enumerate(store["embeddings"]):
        sims.append((idx, cosine_similarity(q_emb, emb)))
    
    # Sort by similarity and return top k
    sims.sort(key=lambda x: x[1], reverse=True)
    results = [(store["chunks"][i], float(score)) for i, score in sims[:top_k]]
    return results
