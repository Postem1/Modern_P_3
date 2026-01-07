# Agentic Architecture

This repository follows a 3-layer architecture:

1.  **Directive (`directives/`)**: SOPs and instructions in Markdown.
2.  **Orchestration**: The AI agent (this conversation) managing the workflow.
3.  **Execution (`execution/`)**: Deterministic Python scripts.

## Directory Structure

-   `directives/`: Operational procedures (What to do).
-   `execution/`: Python tools (Doing the work).
-   `.tmp/`: Intermediate files (regenerated on each run).
