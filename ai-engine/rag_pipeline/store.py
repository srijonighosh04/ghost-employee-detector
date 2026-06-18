import os
import pickle
from langchain_core.vectorstores import InMemoryVectorStore
from ai_engine.embeddings import get_embeddings

DEFAULT_STORE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "knowledge_store.pkl"
)

def load_vector_store(store_path: str = DEFAULT_STORE_PATH) -> InMemoryVectorStore:
    """
    Loads a saved InMemoryVectorStore from disk.
    If the file does not exist, returns a new empty store.
    """
    embeddings = get_embeddings()
    if os.path.exists(store_path):
        try:
            with open(store_path, "rb") as f:
                store_data = pickle.load(f)
                
            # If the pickle contains just the dictionary store, re-create the class
            if isinstance(store_data, dict):
                vector_store = InMemoryVectorStore(embeddings)
                vector_store.store = store_data
                return vector_store
            elif isinstance(store_data, InMemoryVectorStore):
                # Re-bind the active embeddings model to handle runtime API key changes
                store_data.embeddings = embeddings
                return store_data
        except Exception as e:
            print(f"Warning: Failed to load vector store from {store_path}: {e}. Creating a new one.")
            
    return InMemoryVectorStore(embeddings)

def save_vector_store(vector_store: InMemoryVectorStore, store_path: str = DEFAULT_STORE_PATH):
    """
    Saves the InMemoryVectorStore instance to disk as a pickle file.
    """
    os.makedirs(os.path.dirname(store_path), exist_ok=True)
    try:
        with open(store_path, "wb") as f:
            pickle.dump(vector_store, f)
        print(f"Vector store successfully saved to {store_path}")
    except Exception as e:
        print(f"Error: Failed to save vector store: {e}")
