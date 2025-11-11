#!/usr/bin/env python3
"""Simple seed script using the Python Prisma client.

Note: run this after `prisma generate` so the client is available.
"""
import asyncio

from prisma import Prisma


async def main() -> None:
    client = Prisma()
    await client.connect()

    # Create a dev user and a sample task if they don't exist
    user = await client.user.upsert(
        where={"email": "dev@example.com"},
        create={"email": "dev@example.com", "name": "Dev User"},
        update={},
    )

    await client.task.create(
        data={
            "title": "Seed: Welcome task",
            "description": "This task was created by prisma_seed.py",
            "assigneeId": user.id,
        }
    )

    await client.disconnect()
    print("Seeding complete.")


if __name__ == "__main__":
    asyncio.run(main())
