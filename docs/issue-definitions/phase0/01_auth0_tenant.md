# Auth0 tenant + apps configured (task)

Description

- Create an Auth0 tenant for dev (and a separate one for prod)
- Configure Single Page App for Next.js and Machine-to-Machine for backend
- Create roles (poster, worker, admin) and add custom role claim.

Acceptance criteria

- Auth0 tenant exists and credentials/tenant id stored in your secrets manager
- Test login works from local Next.js using `@auth0/nextjs-auth0`
