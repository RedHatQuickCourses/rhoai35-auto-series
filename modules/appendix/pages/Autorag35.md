### 1\. Full Platform & System Requirements to Run AutoRAG on RHOAI 3.5

To execute AutoRAG optimization runs in Red Hat OpenShift AI 3.5, the platform environment requires specific operator configurations, backend connections, vector storage, and model server parameters:

* **OpenShift AI Deployment:** Active Red Hat OpenShift AI 3.5 deployment on OpenShift Container Platform 1\.  
* **Dashboard Feature Flags:** A cluster administrator must set both spec.dashboardConfig.genAiStudio: true and spec.dashboardConfig.autorag: true in the OdhDashboardConfig custom resource to render the GenAI Studio and AutoRAG interfaces 1\.  
* **Data Science Pipelines (DSPA):** An active Data Science Pipeline Server configured in your project 2\. Under Advanced settings, Managed Pipelines must be enabled by checking **Enable AutoML and AutoRAG pipelines** (or setting spec.apiServer.managedPipelines: {} in the DataSciencePipelinesApplication CR) 2\.  
* **OGX Connection:** An active OGX (OpenShift Generative AI Extension) instance connection configured in your data science project containing the OGX base URL and API key 2, 3\.  
* **vLLM Model Server Tool-Calling Flags:** Foundation models served via vLLM **must** be deployed with tool calling explicitly enabled using the model server arguments \--enable-auto-tool-choice and \--tool-call-parser (e.g., \--tool-call-parser=mistral for Mistral models) 2, 4\.  
* **Remote Vector Database:** A remote vector database registered as a Vector I/O Provider with your OGX instance 3, 5\. Supported options in 3.5 are **Milvus** or **pgvector (PostgreSQL)** 5, 6\. *(Inline vector databases are not supported in Technology Preview)* 3, 6\.  
* **S3-Compatible Object Storage:** An accessible S3-compatible data connection attached to your project to store input documents, evaluation datasets, and pipeline artifacts 3\.  
* **Compute Resources:**  
* **Faster Preset (Default):** Requires at least **4 vCPUs and 16 GiB RAM** available for scheduling 7\.  
* **Better Quality Preset:** Requires at least **8 vCPUs and 32 GiB RAM** available for scheduling 7\.  
* **CPU-Only vs. GPU Deployments:** AutoRAG can run on GPU nodes or CPU-only infrastructure using quantized Small Language Models 8, 9\.

### 2\. Input Data Requirements

Before launching an AutoRAG run, you must prepare two input datasets:

* **Document Corpus:**  
* **Supported Formats:** PDF, DOCX, PPTX, Markdown, HTML, or TXT stored in an S3 folder or uploaded via the UI 10, 11\.  
* **Size Limits:** Up to 32 MiB per file for direct UI upload; no file-size limits when selected directly from S3 buckets (AutoRAG automatically samples up to 1 GiB of documents per run) 11-13.  
* **Ground-Truth Evaluation JSON File:**A JSON array containing representative test Q\&A pairs used by AutoRAG to score candidates 11, 14\. Each object must follow this structure 14, 15:  
* \[  
*   {  
*     "question": "What is the return policy?",  
*     "correct\_answers": \[  
*       "Items can be returned within 30 days",  
*       "The return window is 30 days from purchase"  
*     \],  
*     "correct\_answer\_document\_ids": \["policies.pdf", "faq.md"\]  
*   }  
* \]  
* **Crucial Rule:** correct\_answer\_document\_ids must list base filenames only (e.g., policies.pdf), **not** relative or folder paths like documents/policies.pdf 15\.

### 3\. Troubleshooting, Constraints & Use-Case Considerations

Depending on your data types and infrastructure, keep these constraints and troubleshooting rules in mind:

* **Model Count Cap (Avoid Failure):** Select a **maximum of 3 foundation models and 2 embedding models** per optimization run 6, 16\. Exceeding this model limit causes the underlying pipeline execution to fail 6\.  
* **Embedding Model Recommendation:** BAAI/bge-m3 is the recommended default embedding model because it supports over 100 languages, dense and sparse retrieval, and operates with low memory overhead (\~1.1 GB fp16) 17, 18\.  
* **PDF OCR & Table Parsing:**  
* AutoRAG Technology Preview does **not** perform Optical Character Recognition (OCR) on image-only PDFs or extract embedded document images 6\.  
* Table structure detection in PDFs is **only** enabled when using the **Better Quality** run preset (which utilizes Docling hybrid structural chunking to preserve heading hierarchies) 6, 7, 19\.  
* **Multilingual Use Cases:** AutoRAG automatically detects the language of your evaluation questions 17, 20\. However, you must verify that your selected foundation and embedding models support your target document languages in the Model Catalog 8, 17\.  
* **CPU-Only Model Recommendations:** If running on CPU-only infrastructure, use lightweight quantized models such as Phi-4-mini-instruct (Q4\_K\_M) or Qwen3.5-4B-Instruct paired with nomic-embed-text-v1.5 or bge-m3 9, 21\.  
* **Diagnosing Evaluation Metric Gaps:**  
* **High Faithfulness \+ Low Correctness:** The model generated answers strictly grounded in retrieved context without hallucinating, but the retrieved context did not contain the true answer (indicates retrieval chunking or evaluation dataset mismatch) 22\.  
* **High Correctness \+ Low Faithfulness:** The generated answer matched your expected answers, but the LLM pulled from its internal training memory rather than retrieved source chunks (risk of hallucination) 22\.  
* **Low Context Correctness \+ High Answer Correctness:** The retrieval step fetched irrelevant document chunks, but a strong foundation model compensated for poor retrieval. This pattern will be fragile for unseen query types 22\.

### 4\. Testing & Using Prompts/Patterns in GenAI Studio Playground

Once AutoRAG completes a run or when you want to refine system instructions, you can interactively test and govern prompts in the **GenAI Studio Playground** and **Prompt Registry**:  
\[AutoRAG Leaderboard\] ──► \[Try This Pattern / Playground\] ──► \[MLflow Prompt Registry\] ──► \[App REST Endpoint\]

#### Testing AutoRAG Patterns in the Playground

* **"Try This Pattern" Interactive Chat:** From the AutoRAG leaderboard, select **Try this pattern** on any ranked configuration to open an interactive chat panel grounded in your document vector store 23\. You can switch between candidate patterns live to evaluate response quality 23\.  
* **GenAI Studio Playground Tuning:**  
* **Parameter Exploration:** Adjust system instructions, context window limits, temperature settings, and top-\\\\(p\\\\) generation parameters in real time 24-26.  
* **Knowledge Store Binding:** Point the Playground at your uploaded test documents (up to 10 files, max 10MB each) or connect directly to production Milvus/pgvector stores 27, 28\.  
* **MCP Tool Toggles:** Enable or disable Model Context Protocol (MCP) tools per chat session to isolate how retrieval impacts model responses 29\.  
* **Real-Time Streaming Metrics:** View Server-Sent Events (SSE) inline metrics during chat responses, including time-to-first-token (TTFT) and token generation rates 24, 28\.  
* **OpenTelemetry Call-Tree Tracing:** Toggle OpenTelemetry tracing to open the embedded MLflow call-tree view 24, 30\. This visualizes step-by-step execution latency across document retrieval, prompt processing, and LLM generation 24, 30\.  
* **Side-by-Side A/B Comparisons:** Run dual chat sessions side by side to compare outputs across different prompt strings or base models 29\.

#### Exporting Prompts & Patterns for Production

* **Responses API Code Snippets:** Click **View code** on the AutoRAG leaderboard or Playground to export application-ready snippets in **cURL, Python, Go, or Node.js** 23\. These snippets query your OGX /v1/responses API endpoint without requiring application code changes 23, 31\.  
* **Jupyter Notebooks:** Download self-contained **Indexing** and **Inference** Jupyter notebooks to run, audit, or batch-score patterns locally inside OpenShift AI workbenches 23, 32\.  
* **MLflow Prompt Governance:** Once system instructions are finalized, save and version them in the **MLflow Prompt Registry** (Gen AI studio → Prompts) 25, 33\. This assigns version numbers (v1, v2), timestamps, model bindings, and aliases (production, staging), preventing "prompt drift" across development teams 33-35.

🎯 **Next Step Idea:** Would you like to review sample JSON format examples for AutoRAG evaluation files, or walk through a sample Python script for querying the deployed OGX Responses API?  
