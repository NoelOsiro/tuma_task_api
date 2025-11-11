#!/usr/bin/env python3
"""
publish_issues.py

Publish issues to a GitHub repository from a directory of markdown files or a CSV.

Usage examples:
  # dry-run from a folder of markdown files
  python scripts/publish_issues.py --repo myorg/myrepo --dir issue-definitions --dry-run

  # publish from CSV (columns: title,body,labels,assignees,milestone)
  python scripts/publish_issues.py --repo myorg/myrepo --csv issue-export.csv --token $env:GITHUB_TOKEN

The script requires a GitHub token with repo scope (set via --token or GITHUB_TOKEN env var).
"""
from __future__ import annotations

import argparse
import csv
import os
from pathlib import Path
from typing import List, Optional

import yaml
from github import Github, Auth
from github.GithubException import GithubException


def parse_markdown_file(path: Path) -> dict:
    """Parse an optional YAML frontmatter and return a dict with title, body, labels, assignees, milestone."""
    text = path.read_text(encoding="utf-8")
    title = path.stem
    labels: List[str] = []
    assignees: List[str] = []
    milestone = None

    body = text
    if text.startswith("---"):
        # split frontmatter
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm_raw = parts[1]
            body = parts[2].lstrip("\n")
            try:
                fm = yaml.safe_load(fm_raw) or {}
                title = fm.get("title", title)
                labels = fm.get("labels", []) or []
                assignees = fm.get("assignees", []) or []
                milestone = fm.get("milestone")
            except Exception:
                # fallback: ignore frontmatter parse errors
                pass

    return {"title": title, "body": body, "labels": labels, "assignees": assignees, "milestone": milestone}


def publish_issue(repo, title: str, body: str, labels: Optional[List[str]] = None, assignees: Optional[List[str]] = None, milestone: Optional[str] = None, dry_run: bool = False, skip_if_exists: bool = True):
    labels = labels or []
    assignees = assignees or []

    # check duplicates by title
    if skip_if_exists:
        try:
            existing = list(repo.get_issues(state="open", sort="created", direction="desc"))
            for issue in existing:
                if issue.title.strip() == title.strip():
                    print(f"SKIP (exists): {title}")
                    return None
        except Exception:
            # if the check fails, continue to avoid blocking
            pass

    print(f"CREATE: {title}")
    if dry_run:
        return {"title": title, "body": body, "labels": labels, "assignees": assignees, "milestone": milestone}

    gh_labels = labels if labels else None
    gh_assignees = assignees if assignees else None
    gh_milestone = None
    if milestone:
        # try to find milestone by title, or create it
        try:
            for m in repo.get_milestones():
                if m.title == milestone:
                    gh_milestone = m
                    break
            if gh_milestone is None:
                gh_milestone = repo.create_milestone(title=milestone)
        except GithubException as e:
            print(f"Warning: could not find/create milestone '{milestone}': {e}")

    # Build kwargs and avoid passing None values which can trigger assertion errors in PyGithub
    create_kwargs = {"title": title, "body": body}
    if gh_labels:
        create_kwargs["labels"] = gh_labels
    if gh_assignees:
        create_kwargs["assignees"] = gh_assignees
    if gh_milestone:
        create_kwargs["milestone"] = gh_milestone

    try:
        issue = repo.create_issue(**create_kwargs)
        print("Created:", issue.html_url)
        return issue
    except GithubException as e:
        print("Failed to create issue:", e)
        return None


def publish_from_dir(repo, dirpath: Path, dry_run: bool = False, **kwargs):
    files = sorted(dirpath.glob("**/*.md"))
    results = []
    for f in files:
        data = parse_markdown_file(f)
        res = publish_issue(repo, data["title"], data["body"], labels=data.get("labels"), assignees=data.get("assignees"), milestone=data.get("milestone"), dry_run=dry_run, **kwargs)
        results.append((f.name, res))
    return results


def publish_from_csv(repo, csvpath: Path, dry_run: bool = False, **kwargs):
    results = []
    with csvpath.open(encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            title = row.get("title") or row.get("Title")
            body = row.get("body") or row.get("Body") or ""
            labels = [s.strip() for s in (row.get("labels") or "").split(",") if s.strip()]
            assignees = [s.strip() for s in (row.get("assignees") or "").split(",") if s.strip()]
            milestone = row.get("milestone") or None
            res = publish_issue(repo, title, body, labels=labels, assignees=assignees, milestone=milestone, dry_run=dry_run, **kwargs)
            results.append((title, res))
    return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=False, help="Repository in owner/repo format")
    parser.add_argument("--token", help="GitHub token (or set GITHUB_TOKEN env var)")
    parser.add_argument("--dir", help="Directory with markdown files to publish")
    parser.add_argument("--csv", help="CSV file with issues (columns: title,body,labels,assignees,milestone)")
    parser.add_argument("--whoami", action="store_true", help="Validate token and print authenticated username (no repo actions)")
    parser.add_argument("--dry-run", action="store_true", help="Don't create issues, just print what would be done")
    parser.add_argument("--skip-if-exists", action="store_true", default=True, help="Skip creation if an open issue with same title exists (default: True)")
    args = parser.parse_args()

    token = args.token or os.environ.get("GITHUB_TOKEN")
    if not token:
        raise SystemExit("GitHub token required via --token or GITHUB_TOKEN env var")

    # Use the newer auth API to avoid deprecation warnings in PyGithub
    try:
        gh = Github(auth=Auth.Token(token))
    except Exception:
        # Fallback to older constructor if Auth isn't available in this PyGithub version
        gh = Github(token)
    # If the user only wants to validate token, do that and exit safely
    if args.whoami:
        try:
            user = gh.get_user()
            print("Authenticated as:", user.login)
            print("User id:", user.id)
        except Exception as e:
            raise SystemExit(f"Token validation failed: {e}")
        return

    try:
        repo = gh.get_repo(args.repo)
    except Exception as e:
        raise SystemExit(f"Failed to open repo {args.repo}: {e}")

    if args.dir:
        d = Path(args.dir)
        if not d.exists():
            raise SystemExit(f"Directory not found: {d}")
        publish_from_dir(repo, d, dry_run=args.dry_run, skip_if_exists=args.skip_if_exists)
    elif args.csv:
        p = Path(args.csv)
        if not p.exists():
            raise SystemExit(f"CSV file not found: {p}")
        publish_from_csv(repo, p, dry_run=args.dry_run, skip_if_exists=args.skip_if_exists)
    else:
        raise SystemExit("Either --dir or --csv must be provided")


if __name__ == "__main__":
    main()
