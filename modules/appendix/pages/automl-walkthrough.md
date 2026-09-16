# AutoML Demo Walkthrough — OpenShift AI 3.5

> **Source:** Structured narration script for the AutoML demo video (companion to the AutoRAG
> walkthrough). Steps are verified against the official *Red Hat OpenShift AI Self-Managed 3.5,
> Working with AutoML* guide.
> **Scenario:** setting up and running an AutoML optimization for a fictitious bank that wants to
> predict which loan applications are likely to default (a binary classification task).
> **Purpose:** a faithful, step-by-step map of the demo so narration can be recorded against the
> existing screen recording, and so course content can reference the flow accurately.
> **Note on timings:** the time ranges below are *suggested pacing markers*, not transcript
> timestamps. Adjust them to match the final cut of your recording.

## Overview

The demo walks through **AutoML in OpenShift AI 3.5**, from the *Create AutoML optimization run*
starting point all the way to a deployed, queryable model. The presenter builds one end-to-end
example for a fictitious bank using a single CSV of historical loan outcomes, and narrates each
decision point along the way.

Flow shown, in order:

1. Where AutoML lives, and what's already in place before we start
2. Creating the optimization run (name, data source, task type, target column)
3. Tuning the run (top models to consider, optimization metric, training preset)
4. Launching and monitoring the run
5. Reading the leaderboard and model detail views
6. Registering the winner, or saving a notebook
7. Deploying the model for inference on KServe

---

## 1. Setup: what's already in place (0:00–0:30)

AutoML turns raw tabular data into a ranked set of trained models, no manual algorithm picking or
hyperparameter tuning required. Before the demo starts, three things are assumed to be ready:

- A **pipeline server** is configured in the project, with the *Enable AutoML and AutoRAG
  pipelines* checkbox selected in *Advanced settings*.
- The **training data** is a CSV in an S3-compatible bucket: UTF-8 encoded, comma delimited, with
  a header row, and under 32 MiB for dashboard upload (up to 100 MB when read from S3).
- A cluster admin has turned the AutoML dashboard option on (a one-time enablement step, off
  camera).

The presenter opens the dashboard and navigates to **Develop and train > AutoML**, then selects
the project. This is the starting point for everything that follows.

---

## 2. Create the optimization run

### 2.1 Name the run (0:30–0:50)

Click **Create AutoML optimization run**. Enter a **name** (for example, `loan-default-predictor`)
and an optional **description** that captures the business intent, then click **Next**. The name is
how this run shows up on the leaderboard list later, so it's worth making it meaningful.

### 2.2 Point AutoML at the data (0:50–1:25)

Configure the data source:

- From the **S3 connection** list, select an existing data connection, or click **Add new
  connection** to create one.
- Click **Browse bucket** and select the CSV file, here, the bank's historical loan records.

No data cleaning or feature engineering step is required first: AutoML loads the data, samples it if
needed, and splits it into training and test sets on its own.

### 2.3 Choose the prediction task type (1:25–2:05)

Select the **prediction task type**. This is the single most important choice, because it decides
which models, metrics, and detail views you get:

- **Binary classification** (used here): the target has two categories, for example *default* or
  *no default*.
- **Multiclass classification**: three or more categories.
- **Regression**: a continuous number, for example a loan loss amount.
- **Time series forecasting**: sequential values predicted over a future horizon.

For classification or regression, select the **Label column**, the column holding the value to
predict. For time series, you instead select the **Target column**, the **Timestamp column**, and an
**ID column** that identifies each series, optionally add **Known covariates**, and set a
**Prediction length**. In this demo the presenter selects the loan-default label column and moves on.

### 2.4 Tune the run (2:05–2:55)

Two optional dials, both narrated as "sensible defaults, adjust if you have a reason":

- **Top models to consider** (default 3; range 1 to 10 for tabular, 1 to 7 for time series). This is
  how many of the best candidates AutoML refits on the full training set.
- **Optimization metric**: in the **Optimization Metric** card, click **Edit**, pick a metric, and
  click **Save**. The default depends on the task type (for binary classification it's **Accuracy**).
  The presenter notes that on an imbalanced dataset you might switch to a metric that better reflects
  the business cost of a missed default.
- **Preset** (a configuration parameter): **speed** (default) or **balanced**. Balanced allocates
  more CPU and memory for higher quality, but training can take more than twice as long.

The presenter calls out an important guardrail here: **optimization runs cannot be edited after
creation**. If something is wrong, you archive or delete the run and start a new one.

### 2.5 Launch it (2:55–3:10)

Click **Create run**. AutoML begins training candidate models with AutoGluon, and the run appears on
the **AutoML** page with a status you can monitor. Training multiple models takes time, so the demo
cuts to a run that has already completed.

---

## 3. Evaluate the results

### 3.1 The leaderboard (3:10–4:00)

Click the completed run's name to open the results. The **leaderboard** ranks every trained model by
the optimized metric for the task type, with the **top-ranked model highlighted**. Click any column
header to re-sort, for example to compare models on a secondary metric rather than the headline one.

### 3.2 Model detail views (4:00–5:15)

From a model's actions menu, choose **View details**. Depending on the task type, this is where the
"report card" lives:

- **Feature importance**: which inputs drove the predictions, so you can confirm the model leans on
  meaningful signals, not leakage or noise (classification and regression).
- **Confusion matrix**: predicted versus actual classes, to see exactly where the model confuses
  categories (classification only).
- **ROC and precision recall curves**: threshold behavior, with precision recall being the one to
  trust on imbalanced data like loan default (classification only).
- **Backtesting**: rolling-window error and forecast-versus-observed charts (time series only).

The presenter reads feature importance and the confusion matrix together to argue the top model is
both accurate and explainable, not just a lucky score.

---

## 4. Take the winner to production (5:15–6:10)

With a model chosen, there are two escape hatches, both from the actions menu:

- **Register model**: promote the model to a **model registry**, the governed handoff path.
- **Save notebook**: download an auto-generated notebook that loads the trained model from S3 and
  runs predictions on sample data. Run it in a workbench to reproduce or batch-score locally.

To serve it, deploy the registered model version from the registry, selecting **autogluon - 1** for
*Model framework* and **AutoGluon ServingRuntime for KServe** for *Serving runtime*. When the
**Deployments** page shows **Ready**, you have a REST endpoint any application can call for live
predictions. That closes the loop: raw CSV in, governed prediction service out.

---

## Demo Step Summary

| Stage | Where | Key choices |
| :---- | :---- | :---------- |
| Start | Develop and train > AutoML | Select the project, click *Create AutoML optimization run* |
| Name | Step 1 | Run name + optional description |
| Data source | Step 2 | S3 connection, then *Browse bucket* to pick the CSV |
| Task type | Step 3 | Binary / Multiclass / Regression / Time series + label or target columns |
| Tuning | Step 4 | Top models to consider (default 3), optimization metric, preset (speed/balanced) |
| Launch | Step 5 | *Create run*, then monitor status on the AutoML page |
| Leaderboard | Results | Ranked by the optimized metric, top model highlighted, sortable |
| Model details | Results | Feature importance, confusion matrix, ROC/PR curves, backtesting |
| Handoff | Actions menu | *Register model* to a registry, or *Save notebook* |
| Deploy | Model registry | autogluon - 1 + AutoGluon ServingRuntime for KServe, wait for *Ready* |

## Narration notes

- Keep the energy identical to the AutoRAG walkthrough: one concrete scenario, plain language, and a
  short "why this matters" beat at each decision point rather than a dry click-by-click.
- Reinforce the two big AutoML promises whenever they show on screen: **no manual algorithm or
  hyperparameter choices** (AutoGluon handles that), and **a report card you can defend** (feature
  importance + confusion matrix + curves).
- Technology Preview reminder if useful on camera: AutoML is Tech Preview in 3.5 and moves to GA in
  3.6, so the workflow shown here is what becomes production-supported.
