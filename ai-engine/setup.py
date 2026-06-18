from setuptools import setup

setup(
    name="ai_engine",
    version="1.0.0",
    packages=[
        "ai_engine",
        "ai_engine.chains",
        "ai_engine.embeddings",
        "ai_engine.prompts",
        "ai_engine.rag_pipeline"
    ],
    package_dir={
        "ai_engine": ".",
        "ai_engine.chains": "chains",
        "ai_engine.embeddings": "embeddings",
        "ai_engine.prompts": "prompts",
        "ai_engine.rag_pipeline": "rag_pipeline",
    },
    install_requires=[
        "langchain",
        "langchain-community",
        "langchain-google-genai",
        "pydantic"
    ]
)
