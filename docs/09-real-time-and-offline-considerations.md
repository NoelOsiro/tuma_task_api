# 9. Real-time & offline considerations

- Use **FCM** for push notifications. Keep critical flows (accept / payment) tolerant to missed push (fallback to SMS).
- Design offline resubmission: worker can mark completed offline; app syncs when online (with proof attachments).
- Limit background GPS frequency to balance battery & location freshness (e.g., every 10–30s while online and active).

These choices help the app remain robust under intermittent connectivity common in the target markets.
