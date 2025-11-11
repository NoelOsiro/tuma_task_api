# 8. Payment flow (M-Pesa Daraja)

**High-level:**

1. Poster confirms assignment → frontend calls `/payments/initiate` with `assignment_id` and `amount`.
2. Backend calls Daraja STK Push API (sandbox/production), storing `mpesa_checkout_request_id` + `status=PENDING`.
3. M-Pesa sends callback to `/payments/webhook` (or you poll query endpoint). Backend updates `payments` record → `HELD`/`PAID`.
4. On assignment completion & poster confirmation → backend `release_payment` moves funds from held ledger to worker `wallet`.
5. Worker requests withdraw → backend triggers Daraja B2C payout; handle payout failures/retries and logging.

**Important:** Implement idempotency (M-Pesa callbacks may retry), verification of amounts, and webhooks secured with secrets or IP whitelisting.
