# 5. Matching & proximity strategy

**Goal:** fast, reliable “find nearest available worker” with low cost.

**Mechanisms:**

- Workers report location periodically (mobile background updates). Store `auth0_id -> (lat, lng, last_seen_ts)` in Redis via `GEOADD`.
- When a task posts:
  1. FastAPI pushes task to a Redis matching queue (sorted by time).
  2. Matching service performs `GEORADIUS` around task coords to get nearby workers (within poster-defined radius or default).
  3. Score workers by `distance`, `rating`, `acceptance_rate`, `current_load`, `response_time`.
  4. Notify top-N (e.g., 3–5) workers via FCM (or in-app). Workers have a small timeout (e.g., 20s) to accept.
  5. First accept locks the task (use Redis SETNX or DB transaction) and backend writes `assignments`.
  6. If nobody accepts, widen radius / switch to bidding flow.

**Redis roles:**

- Presence & geo index (fast lookup)
- Locking primitives for assignment (e.g., `SET task:lock:<taskId> ... NX PX`)
- Queue for retries and escalation
