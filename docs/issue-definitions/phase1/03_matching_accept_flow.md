# Matching + accept flow (lock & assignment) (task)

Description

- Implement matching service that uses GEORADIUS to find workers
- Implement lock (SETNX) or DB transaction to ensure single acceptor

Acceptance

- End-to-end flow from task post → notifications → accept → assignment recorded
