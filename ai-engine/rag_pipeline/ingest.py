import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from ai_engine.rag_pipeline.store import load_vector_store, save_vector_store

DOCS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "knowledge_docs"
)

def run_ingestion():
    """
    Ingests, chunks, embeds, and indexes all markdown files
    in the knowledge_docs folder, then saves the vector store.
    """
    print(f"Starting document ingestion from: {DOCS_DIR}")
    
    if not os.path.exists(DOCS_DIR):
        print(f"Error: Documents directory {DOCS_DIR} does not exist.")
        return
        
    # Find all markdown files
    files = [f for f in os.listdir(DOCS_DIR) if f.endswith(".md")]
    print(f"Found {len(files)} documents to ingest.")
    
    documents = []
    for filename in files:
        file_path = os.path.join(DOCS_DIR, filename)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Extract document ID from name (e.g. d1.md -> d1)
            doc_id = os.path.splitext(filename)[0]
            
            # Simple header extraction for metadata
            first_line = content.split("\n")[0] if content else ""
            title = first_line.replace("#", "").strip() if first_line.startswith("#") else doc_id
            
            doc = Document(
                page_content=content,
                metadata={
                    "id": doc_id,
                    "title": title,
                    "source": filename
                }
            )
            documents.append(doc)
            print(f"Loaded {filename} - Title: '{title}'")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            
    if not documents:
        print("No documents loaded. Ingestion cancelled.")
        return
        
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} text chunks.")
    
    # Load (or initialize) vector store
    vector_store = load_vector_store()
    
    # Add chunks
    print("Generating embeddings and indexing chunks...")
    vector_store.add_documents(chunks)
    
    # Save vector store to disk
    save_vector_store(vector_store)
    print("Ingestion run successfully completed.")

if __name__ == "__main__":
    run_ingestion()
