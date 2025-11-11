# M-Pesa sandbox STK flow (initiate + simulate webhook) (task)

Description

- Implement `/payments/initiate` to call Daraja sandbox STK push
- Implement `/payments/webhook` to receive callbacks and mark payment status

Acceptance

- Simulated STK flow updates `payments` record to PENDING then to PAID on webhook
