from __future__ import annotations


def dispatch_event_notification(event_id: int) -> dict[str, int | bool]:
    return {"event_id": event_id, "dispatched": True}
