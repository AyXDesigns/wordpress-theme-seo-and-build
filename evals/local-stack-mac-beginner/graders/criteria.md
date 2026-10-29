---
type: llm
---

PASS if the reply asks a few questions about the user's situation and/or presents 2-4 local environment options (for example LocalWP, WordPress Studio, DDEV) with advantages and disadvantages for each, recommends one that suits a beginner on macOS, and waits for the user's choice before installing anything.
FAIL if the reply installs or tells the user to install a specific stack without presenting options and trade-offs, or recommends XAMPP as the default for macOS without discussing alternatives.
