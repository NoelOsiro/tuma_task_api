# 10. Deployment & scaling

## Containers & infra

- Containerize with Docker.
- Deploy using ECS / EKS / DigitalOcean / Render / Fly.io (start small).
- Use managed Postgres (Heroku, RDS, Supabase) and managed Redis (Upstash, Redis Labs).

## Scaling

- FastAPI instances behind load balancer (nginx/ALB).
- Redis handles ephemeral load; scale as workers grow.
- Run matching engine as horizontally scalable workers reading from queue.
- Use read replicas for analytics heavy reads.

## CI/CD

- Build pipelines for frontend & backend.
- DB migrations with Prisma Migrate (or another migration tool); run Prisma migrations from a migration service or CI step.
- Secrets stored in vault (e.g., AWS Secrets Manager, GitHub Secrets).
