export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate sm:flex-row">
        <span>© {new Date().getFullYear()} Sentinel. Built for the knowledge continuity hackathon track.</span>
        <span className="font-mono">Next.js · FastAPI · Neo4j · ChromaDB · Gemini</span>
      </div>
    </footer>
  );
}
