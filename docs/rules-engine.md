# Deterministic Rule Engine

Rules are processed in order of priority score:
1. **EXACT_PHRASE** (Score 100 + Priority)
2. **EXACT_KEYWORD** (Score 80 + Priority)
3. **PARTIAL_KEYWORD** (Score 70 + Priority)
4. **MULTIPLE_KEYWORDS** (Score 75 * Match ratio + Priority)
5. **INTENT_CATEGORY** (Score 65 + Priority)
