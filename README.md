# Governing AI Data Workflows: AutoML and AutoRAG Strategies

> ⚠️ **Work in progress (WIP).** This course is under active development. Chapter and section pages are currently scaffolded outlines — content is incomplete and subject to change, and page bodies still carry `Not started yet` warnings. Do not treat this material as final or publish it externally yet.

## About this course

This course teaches technical professionals how to strategically evaluate use cases and apply **AutoML** (predictive modeling) and **AutoRAG** (generative retrieval) in **Red Hat OpenShift AI 3.5+** to drive measurable business value.

It focuses on the practitioner experience — the Data Scientist and AI Engineer platform capabilities — rather than infrastructure management. As the first entry in the **Connecting Data to Models and Agents** enablement series, it emphasizes terminology, best practices, and business value using diagrams, Summit Arcade interactive clickthroughs, and video walkthroughs. **No hands-on user labs are required.**

### Target audience

- **Primary personas:** Data Scientists, AI Engineers, and Technical Solution Architects evaluating or adopting Red Hat OpenShift AI 3.5+.
- **Technical level (TL2):** Technical practitioners and field specialists who want to understand the "why", decision points, trade-offs, and business outcomes of automated capabilities — without performing cluster admin setup.
- **Distribution:** Publicly discoverable enablement for global Red Hat field teams, ecosystem partners, and enterprise customers.

## Course outline

| # | Chapter | Focus |
|---|---------|-------|
| 1 | Predictive Foundations with AutoML | When to apply AutoML to turn raw tabular/time-series data into production-ready predictive models. |
| 2 | Validating and Deploying AutoML Models | Using leaderboards, feature importance, and ROC/PR curves to validate and promote winning models to production. |
| 3 | Prompt Engineering and MLflow Governance | Moving from predictive data to generative text; versioning prompts and eliminating "prompt drift" with MLflow. |
| 4 | Optimizing Retrieval with AutoRAG | Benchmarking chunking, embedding, and vector database configurations for grounded LLM applications. |
| 5 | Knowledge Review and Assessment | End-to-end synthesis of AutoML, MLflow, and AutoRAG, plus a scenario-based graded quiz. |

## Status

| Item | State |
|------|-------|
| Course structure & navigation | ✅ Scaffolded |
| Chapter/section outlines | ✅ Drafted from course design |
| Page content | 🚧 In progress (`Not started yet`) |
| Interactive assets (Arcade, video, quiz) | 🚧 Pending |
| Review & sign-off | ⬜ Not started |

The authoritative design lives in [`prompts/course_design.md`](./prompts/course_design.md).

## Previewing the course locally

This is an [Antora](https://antora.org/) course. To build and preview:

```
npm install

# Build once
npm run build

# Or watch for changes and serve a live preview
npm run watch:adoc   # rebuilds on edits to ./modules
npm run serve        # serves build/site (see the printed URL)
```

Generate a PDF with `npm run generate-pdf`.

## Development

- [Getting started with the training template](#getting-started-with-a-new-training-content-repository) (below)
- [Development using devspace](./DEVSPACE.md)
- [Guideline for editing your content](./USAGEGUIDE.adoc)

---

