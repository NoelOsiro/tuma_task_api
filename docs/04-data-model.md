# 4. Data model (core tables — simplified)

Use UUID PKs and SQLModel/SQLAlchemy for schemas. Below is a compact ER-like listing.

```bash
users
  id (uuid)
  auth0_id (string, unique)
  name
  phone
  email
  role (poster|worker|admin)
  verified boolean
  created_at

profiles
  id
  user_id -> users.id
  bio
  skills (json or text array)
  rating_avg
  location_lat float
  location_lng float
  service_radius_km int

tasks
  id
  poster_id -> users.id
  title
  description
  category
  location_lat
  location_lng
  price_fixed (nullable)
  currency
  status (OPEN/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED/DISPUTED)
  created_at
  due_at

offers
  id
  task_id -> tasks.id
  worker_id -> users.id
  price
  message
  status (PENDING/ACCEPTED/REJECTED)

assignments
  id
  task_id -> tasks.id (unique)
  worker_id -> users.id
  started_at
  completed_at
  status (ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED)

payments
  id
  assignment_id -> assignments.id
  amount
  currency
  status (PENDING/HELD/PAID/REFUNDED/FAILED)
  mpesa_ref
  created_at

ratings
  id
  rater_id -> users.id
  ratee_id -> users.id
  task_id -> tasks.id
  score int
  comment text

disputes
  id
  task_id
  raised_by -> users.id
  reason
  evidence_url
  status (OPEN/RESOLVED/REJECTED)
```

Indexes: geo indexes on `location_lat/lng` (GiST or PostGIS), FK indexes, `tasks(status)`.
