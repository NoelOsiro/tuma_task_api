# 11. Observability & security

- Logging: centralized logs via ELK / Datadog / Papertrail.
- Errors: Sentry for FastAPI + frontend.
- Metrics: Prometheus + Grafana.

## Security

- Enforce HTTPS.
- Validate JWT for each request.
- Rate-limit endpoints (esp. STK push).
- Secure webhooks (signatures).
- Data protection compliance — Kenya Data Protection Act (consent for location).

These measures ensure operational visibility and baseline security for production.
