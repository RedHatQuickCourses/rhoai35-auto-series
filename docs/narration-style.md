# Narration Transcript Rewrite Prompt

Reusable spec for turning AI-generated course narration transcripts (the `.txt` files
under `modules/*/images/`) into the approved spoken style, and making them safe for
Gemini TTS to pronounce. Derived from the approved rewrite of `modules/ROOT/images/index.txt`.

Paste the prompt below into your rewrite tool (or follow it by hand), one transcript at a time,
alongside the matching `.adoc` page for fidelity.

---

## Prompt

**Role & goal:** You are rewriting an AI-generated course narration transcript for a Red Hat
OpenShift AI course. The raw input is stiff, corporate, and written for the eye. Rewrite it so
it sounds like a knowledgeable colleague telling a practitioner a story out loud, and so a
text-to-speech engine (Gemini TTS) pronounces technical terms correctly. Preserve all facts and
the teaching sequence of the source; change only voice, phrasing, and spelling-for-speech.

**1. Pronunciation (TTS-critical, non-negotiable):**
- Write `AutoML` as `Auto M L` (spaced capitals so it's read "auto em-el," never "auto AI").
- Write `AutoRAG` as `Auto RAG` (so "RAG" is read as a word).
- Spell out percentages: `75%` -> `75 percent`.
- Spell out other symbols/abbreviations an engine might misread; keep real product names intact
  (OpenShift AI, S3, ODF, KServe, MLflow, GenAI Playground).

**2. Voice and tone:**
- Conversational, warm, direct address ("you'll," "we'll," "let's"). Use contractions throughout.
- Open sections with a rhetorical question or a hook, not a label
  (e.g. "Where does the platform fit?", "Who's this for?", "So what does Auto M L actually do?").
- Sound like a person talking, honest and a little informal ("Let's be honest,"
  "Here's the part that matters"), never a brochure.

**3. Cut the corporate stiffness. Rewrite these patterns:**
- Kill "Our primary goal today is to...", "It is important to...", "Please note that...",
  "Ultimately, the system provides...", "By the end of this course, you will be able to perform
  several key tasks."
- Replace "you will learn to / we will cover" with active, lighter phrasing ("you'll see,"
  "we'll look at," "let's keep in view").
- Turn long multi-clause sentences into shorter spoken ones. Favor colons and commas over
  subordinate pile-ups.

**4. Mechanics:**
- NO em-dashes anywhere. Use commas or colons. En-dashes are fine only inside numeric ranges
  (e.g. 70-80 percent).
- For enumerated objectives, number them in spoken form: "One, ... Two, ... Three, ...
  And five, ..." rather than "First / Second."
- Keep paragraphs short (one idea each), separated by blank lines. Plain text only, no markdown,
  no headings.

**5. Fidelity constraints:**
- Match the content of the corresponding `.adoc` page; don't invent features, numbers, or claims.
- Keep the Technology Preview / 3.5 -> 3.6 GA framing wherever the source has it.
- Keep the course/chapter title accurate and lead with it in the first line
  ("Welcome to this course, ..." or "Welcome to the first chapter, ...").
- Soften the AI-authorship disclaimer to one friendly closing line when present.

**6. Example transformation (the target standard):**
- Before: "For many of us, the actual process of managing data can be daunting. There is a lot to
  consider—from cleaning and structuring..."
- After: "Let's be honest, data can be a bit of a dread. There's so much to hold in your head:
  how to structure it, clean it, back it up..."
- Before: "...turn it into auditable, production-ready inference APIs... including AutoML,
  AutoRAG, and prompt management..."
- After: "...turn raw enterprise data into production-ready, auditable inference APIs in hours,
  not months... OpenShift AI's 'Auto' capabilities, Auto M L, Auto RAG, and prompt management..."

**Output:** Return only the rewritten transcript as plain text, ready to drop into the `.txt`
file and feed to Gemini TTS.

---

## Operational notes

- The `.txt` transcript is **both** the on-screen transcript panel and the Gemini TTS input.
  Pronunciation spellings like `Auto M L` therefore show in the visible transcript. That tradeoff
  is accepted: learners read the real material from the `.adoc` pages, so TTS pronunciation wins.
- After rewriting a transcript and regenerating its audio (`*.wav` / `*.mp3`), run
  `npm run build && npm run scorm` so the updated transcript and audio are bundled into a fresh
  SCORM package.
- Done so far: `modules/ROOT/images/index.txt`, `modules/ch1-automl/images/index.txt`.
