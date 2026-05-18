#!/usr/bin/env python3
"""Create a run-scoped questionnaire artifact directory."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import webbrowser
from datetime import datetime
from pathlib import Path
from urllib.parse import quote


ROOT_MARKERS = (
    ".git",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "app",
    "docs",
)

TIMESTAMP_RE = re.compile(r"^\d{4}-\d{2}-\d{2}:\d{2}-\d{2}-\d{2}$")


def is_project_root(path: Path) -> bool:
    return any((path / marker).exists() for marker in ROOT_MARKERS)


def prompt_project_dir(cwd: Path) -> Path:
    print(f"No project root marker found in: {cwd}")
    print("Enter the project directory where .questionnaire/ should be created.")
    raw = input("Project directory: ").strip()
    if not raw:
        raise SystemExit("No project directory supplied.")
    path = Path(raw).expanduser().resolve()
    if not path.exists() or not path.is_dir():
        raise SystemExit(f"Project directory does not exist: {path}")
    return path


def resolve_project_dir(raw_project_dir: str | None) -> Path:
    if raw_project_dir:
        project_dir = Path(raw_project_dir).expanduser().resolve()
        if not project_dir.exists() or not project_dir.is_dir():
            raise SystemExit(f"--project-dir is not a directory: {project_dir}")
        return project_dir

    cwd = Path.cwd().resolve()
    if is_project_root(cwd):
        return cwd

    if sys.stdin.isatty():
        return prompt_project_dir(cwd)

    raise SystemExit(
        "Current directory does not look like a project root. "
        "Pass --project-dir <path> in non-interactive runs."
    )


def make_timestamp(raw_timestamp: str | None) -> str:
    timestamp = raw_timestamp or datetime.now().strftime("%Y-%m-%d:%H-%M-%S")
    if not TIMESTAMP_RE.match(timestamp):
        raise SystemExit(
            "Timestamp must match YYYY-MM-DD:HH-MM-SS, "
            f"got: {timestamp}"
        )
    return timestamp


def file_url(path: Path) -> str:
    return "file://" + quote(str(path.resolve()))


def initial_state(project_dir: Path, run_dir: Path, timestamp: str) -> dict:
    question_id = "q-0001-opening"
    created_at = timestamp
    return {
        "run": {
            "id": timestamp,
            "created_at": created_at,
            "run_dir": str(run_dir),
            "index_html": str(run_dir / "index.html"),
            "status": "active",
        },
        "project": {
            "root": str(project_dir),
            "name": project_dir.name,
            "root_markers": [
                marker for marker in ROOT_MARKERS if (project_dir / marker).exists()
            ],
        },
        "current_question": question_id,
        "questions": [
            {
                "id": question_id,
                "status": "active",
                "prompt": "What do you want to configure, decide, or stress-test in this questionnaire run?",
                "recommended_answer": "Agent: replace this starter recommendation with a task-specific recommendation before presenting the run.",
                "why_it_matters": "The opening answer determines which decision branch, evidence search, glossary terms, and artifacts should be created first.",
                "answer_type": "freeform",
                "options": [],
                "custom_option_enabled": False,
                "user_answer": "",
                "research_required": False,
                "research_artifact": "",
                "follow_up_logic": [],
                "created_at": created_at,
            }
        ],
        "decisions": [],
        "glossary": [],
        "research": [],
        "adrs": [],
        "exports": {
            "transcript": "transcript.md",
            "context": "CONTEXT.md",
            "state": "state.json",
        },
        "ui": {
            "active_tab": "Question",
            "layout": "agent_guided",
            "theme": "dark_lacquer_brass",
            "local_draft_enabled": True,
        },
    }


def write_initial_files(project_dir: Path, run_dir: Path, timestamp: str) -> None:
    skill_dir = Path(__file__).resolve().parents[1]
    template = skill_dir / "assets" / "questionnaire-template.html"
    if not template.exists():
        raise SystemExit(f"Missing template: {template}")

    run_dir.mkdir(parents=True, exist_ok=False)
    (run_dir / "research").mkdir()
    (run_dir / "adrs").mkdir()
    shutil.copyfile(template, run_dir / "index.html")

    state = initial_state(project_dir, run_dir, timestamp)
    (run_dir / "state.json").write_text(
        json.dumps(state, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (run_dir / "transcript.md").write_text(
        "# Questionnaire Transcript\n\n"
        f"- Run: `{timestamp}`\n"
        f"- Project: `{project_dir}`\n\n"
        "## Opening\n\n"
        "The agent should rewrite the starter question for the actual task before continuing.\n",
        encoding="utf-8",
    )
    (run_dir / "CONTEXT.md").write_text(
        "# Questionnaire Context\n\n"
        "This file is a glossary for reusable domain terms captured during the questionnaire.\n\n"
        "## Terms\n\n",
        encoding="utf-8",
    )


def should_open(args: argparse.Namespace) -> bool:
    if args.open:
        return True
    if args.no_open:
        return False
    if not sys.stdin.isatty():
        return False
    raw = input("Open generated index.html in a browser? [y/N]: ").strip().lower()
    return raw in {"y", "yes"}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Start a run-scoped questionnaire session."
    )
    open_group = parser.add_mutually_exclusive_group()
    open_group.add_argument("--open", action="store_true", help="Open index.html without prompting.")
    open_group.add_argument("--no-open", action="store_true", help="Do not open index.html.")
    parser.add_argument("--project-dir", help="Explicit project root.")
    parser.add_argument("--timestamp", help="Deterministic timestamp: YYYY-MM-DD:HH-MM-SS.")
    args = parser.parse_args()

    project_dir = resolve_project_dir(args.project_dir)
    timestamp = make_timestamp(args.timestamp)
    run_dir = project_dir / ".questionnaire" / timestamp
    if run_dir.exists():
        raise SystemExit(f"Run directory already exists: {run_dir}")

    write_initial_files(project_dir, run_dir, timestamp)
    index_path = run_dir / "index.html"
    url = file_url(index_path)

    if should_open(args):
        webbrowser.open(url)
        opened = "yes"
    else:
        opened = "no"

    print(f"Run directory: {run_dir}")
    print(f"Index URL: {url}")
    if opened == "no":
        print("Open the Index URL in a browser, or run again with --open.")
    else:
        print("Opened index.html in the default browser.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
