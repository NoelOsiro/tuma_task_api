"""Prisma client wrapper for the application.

This module provides a singleton Prisma client and simple connect/disconnect helpers
that can be used by the app lifespan handlers.
"""
from prisma import Prisma

client = Prisma()


async def connect() -> None:
    """Connect the Prisma client."""
    await client.connect()


async def disconnect() -> None:
    """Disconnect the Prisma client."""
    await client.disconnect()


def get_client() -> Prisma:
    """Return the Prisma client instance (connected or not)."""
    return client
