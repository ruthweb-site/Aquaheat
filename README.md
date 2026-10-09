# AquaHeat

AquaHeat is a Mumbai-focused heat safety web application. It aims to help people understand current and upcoming heat risk in different parts of Mumbai and receive personalized safety recommendations based on their planned activity.

> **Project status: repository structure only.**
> The project is being developed incrementally, in small phases. The current phase creates the folder layout and basic documentation. **Nothing described under "Planned architecture" is implemented yet.** There is no frontend, backend, ML model, or AWS infrastructure in this repository at this point.

## What AquaHeat is (and is not)

AquaHeat describes **environmental heat risk** and **personal exposure risk** (for example, how risky it is to do a given activity outdoors at a given time and place).

AquaHeat does **not** diagnose heatstroke or any other medical condition, and does **not** predict that a person will get heatstroke. It is not a substitute for medical advice or emergency services.

## MVP scope

Planned for the MVP:

- Current and upcoming heat-risk view for six representative zones in Mumbai
- Personalized safety recommendations based on the user's activity
- Heat-risk prediction from an ML model trained and hosted on Amazon SageMaker
- Deterministic, rule-based emergency guidance (reviewed for safety, not LLM-generated)
- Alerts for elevated heat risk

Out of scope for now: cities other than Mumbai, medical diagnosis, and any external LLM acting as the core heat-risk engine.

## Mumbai zones

AquaHeat uses six representative zones. Each zone is tied to one **representative weather point**. These are **not** official administrative boundaries.

| # | Zone | Representative location |
|---|------|-------------------------|
| 1 | South Mumbai | Colaba |
| 2 | Western Suburbs | Andheri |
| 3 | Eastern Suburbs | Ghatkopar |
| 4 | Central Mumbai | Dadar |
| 5 | Harbour | Chembur |
| 6 | Northern Mumbai | Borivali |

## Planned architecture

All of the following is **planned, not built**.

- **Frontend:** Next.js + TypeScript, responsive UI, to be hosted on AWS Amplify Hosting
- **API layer:** Amazon API Gateway with authenticated access only (no public unauthenticated APIs), using Amazon Cognito
- **Compute:** AWS Lambda functions for weather ingestion, heat risk, recommendations, emergency guidance, and alerts
- **Storage:** Amazon DynamoDB for application data; Amazon S3 for data and model artifacts (no wildcard CORS)
- **Scheduling:** Amazon EventBridge for periodic weather ingestion
- **Notifications:** Amazon SNS for alerts
- **Observability:** Amazon CloudWatch
- **Machine learning:** Amazon SageMaker (Python) for the heat-risk prediction model
- **Infrastructure as Code:** AWS SAM
- **Weather data:** Open-Meteo initially; IMD data/warnings may be integrated later if a suitable official source is available

Principles: AWS provides the core infrastructure (no Vercel), least-privilege IAM, and no unnecessary AWS services.

## Repository layout

| Path | Purpose |
|------|---------|
| `app/frontend/` | Next.js + TypeScript web app (not yet created) |
| `backend/functions/` | One folder per Lambda function: `weather-ingestion`, `heat-risk`, `recommendations`, `emergency`, `alerts` |
| `backend/shared/` | Code shared between Lambda functions |
| `ml/` | Machine learning: `data/`, `training/`, `inference/`, `model/` |
| `infra/` | AWS SAM / infrastructure as code |
| `tests/` | `unit/`, `integration/`, `e2e/` tests |
| `docs/` | Project documentation |
| `scripts/` | Helper scripts |

Empty folders contain a `.gitkeep` file so Git tracks them. These will be removed as real files are added.

## Development approach

The project is built in phases, and each phase is reviewed before the next begins.

- **Phase 1 (current):** repository structure and basic documentation only

## License

See [LICENSE](LICENSE).
