import os
from langchain_google_genai import ChatGoogleGenerativeAI
from ai_engine.rag_pipeline.store import load_vector_store
from ai_engine.prompts.templates import ASSISTANT_PROMPT

def get_llm():
    """
    Get the ChatGoogleGenerativeAI instance if API keys are set.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if api_key:
        try:
            return ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.2
            )
        except Exception as e:
            print(f"Warning: Failed to load ChatGoogleGenerativeAI: {e}")
    return None

def run_assistant_chain(query: str, db_context: str) -> dict:
    """
    Runs the RAG chain over retrieved vector documents and database entities.
    """
    # 1. Retrieve relevant chunks from InMemoryVectorStore
    vector_store = load_vector_store()
    try:
        docs = vector_store.similarity_search(query, k=2)
        rag_context = "\n\n".join([
            f"--- Document: {d.metadata.get('title')} (File: {d.metadata.get('source')}) ---\n{d.page_content}"
            for d in docs
        ])
        cited_docs = list(set([d.metadata.get("title") for d in docs if d.metadata.get("title")]))
    except Exception as e:
        print(f"Warning: RAG search failed: {e}")
        rag_context = "No matching documentation found."
        cited_docs = []
        
    llm = get_llm()
    if llm:
        try:
            prompt_val = ASSISTANT_PROMPT.format(
                db_context=db_context,
                rag_context=rag_context,
                query=query
            )
            response = llm.invoke(prompt_val)
            return {
                "content": response.content,
                "cited_docs": cited_docs if cited_docs else None
            }
        except Exception as e:
            print(f"Warning: LLM invocation failed: {e}. Falling back to rule-based response.")
            
    # Pure-Python Fallback (for keyless local workspace runs)
    # Perform basic search matching
    q_lower = query.lower()
    
    # Check if we retrieved documents containing keywords
    best_matching_doc = None
    for d in docs:
        if any(w in d.page_content.lower() for w in q_lower.split()):
            best_matching_doc = d
            break
            
    if best_matching_doc:
        doc_title = best_matching_doc.metadata.get("title")
        content = (
            f"According to internal files, here is what I found on that in the '{doc_title}' runbook:\n\n"
            f"{best_matching_doc.page_content[:400]}...\n\n"
            "Would you like me to draft a transition brief for the primary owner of this system?"
        )
        return {
            "content": content,
            "cited_docs": [doc_title]
        }
        
    # Standard response
    return {
        "content": (
            "I searched our internal knowledge base but couldn't find a runbook directly matching your query. "
            "Based on our database graph, you can ask about our core infrastructure ownership (e.g. Priya Nair) "
            "or run simulations for active engineers."
        )
    }
