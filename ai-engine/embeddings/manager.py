import os
import hashlib
from typing import List
from langchain_core.embeddings import Embeddings

class MockEmbeddings(Embeddings):
    """
    A deterministic, pure-Python MockEmbeddings generator.
    Enables cosine similarity vector searching without requesting external APIs
    or requiring compilation of heavy machine-learning packages.
    """
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._embed(t) for t in texts]
        
    def embed_query(self, text: str) -> List[float]:
        return self._embed(text)
        
    def _embed(self, text: str) -> List[float]:
        # Generate a deterministic 768-dimension vector based on SHA-256 hash of text
        h = hashlib.sha256(text.encode("utf-8")).digest()
        vector = []
        for i in range(768):
            val = (h[i % 32] + (i * 17)) % 256
            vector.append(float(val) / 256.0 - 0.5)
        return vector

def get_embeddings() -> Embeddings:
    """
    Factory to return GoogleGenAIEmbeddings if API key is present,
    otherwise falls back to MockEmbeddings.
    """
    # Check both GEMINI_API_KEY and GOOGLE_API_KEY
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    
    if api_key:
        try:
            from langchain_google_genai import GoogleGenAIEmbeddings
            return GoogleGenAIEmbeddings(
                model="models/embedding-001",
                google_api_key=api_key
            )
        except Exception as e:
            print(f"Warning: Failed to load GoogleGenAIEmbeddings: {e}. Falling back to MockEmbeddings.")
            
    return MockEmbeddings()
