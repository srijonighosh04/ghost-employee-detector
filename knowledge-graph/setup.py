from setuptools import setup

setup(
    name="knowledge_graph",
    version="1.0.0",
    packages=[
        "knowledge_graph",
        "knowledge_graph.graph_models",
        "knowledge_graph.cypher_queries",
        "knowledge_graph.scripts"
    ],
    package_dir={
        "knowledge_graph": "."
    },
    install_requires=[
        "neo4j"
    ]
)
