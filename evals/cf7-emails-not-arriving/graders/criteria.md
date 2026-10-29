---
type: llm
---

PASS if the reply explains that the success message does not prove delivery, checks whether a stored record exists (for example Flamingo), reviews the From address and domain authentication (SPF, DKIM, DMARC), and offers mail-sending options with pros and cons before changing DNS or installing an SMTP plugin.
FAIL if the reply immediately tells the user to install a specific SMTP plugin without diagnosis, or assumes the email was sent because the form said so.
