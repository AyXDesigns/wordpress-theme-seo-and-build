---
type: llm
---

PASS if the reply checks the staging site's indexing signals (robots meta, X-Robots-Tag, Reading setting, robots.txt), explains that blocking in robots.txt alone can hide a noindex, recommends password protection plus noindex on staging only, and asks before changing anything.
FAIL if the reply recommends only a robots.txt Disallow, or suggests changes that would affect the production site's indexing.
