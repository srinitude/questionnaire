#!/usr/bin/env python3
"""Validate questionnaire state.json files."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


TOP_LEVEL_KEYS = [
    "run",
    "project",
    "current_question",
    "questions",
    "decisions",
    "glossary",
    "research",
    "adrs",
    "exports",
    "ui",
]

QUESTION_FIELDS = [
    "id",
    "status",
    "prompt",
    "recommended_answer",
    "why_it_matters",
    "answer_type",
    "options",
    "custom_option_enabled",
    "user_answer",
    "research_required",
    "research_artifact",
    "follow_up_logic",
    "created_at",
]

VALID_STATUSES = {
    "active",
    "pending",
    "answered",
    "skipped",
    "blocked",
    "archived",
}

VALID_ANSWER_TYPES = {
    "freeform",
    "single_choice",
    "multi_choice",
    "ranked_choice",
    "scale",
    "yes_no",
    "file_upload",
    "matrix",
    "branching",
}

FOLLOW_UP_FIELDS = ["when", "operator", "value", "next_question_id", "note"]


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON: {exc}") from exc


def is_non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def resolve_reference(state_path: Path, reference: str) -> Path:
    ref_path = Path(reference)
    if ref_path.is_absolute():
        return ref_path
    return state_path.parent / ref_path


def check_reference(
    errors: list[str],
    state_path: Path,
    label: str,
    reference: Any,
) -> None:
    if reference in ("", None):
        return
    if not isinstance(reference, str):
        errors.append(f"{label} must be a string when present.")
        return
    target = resolve_reference(state_path, reference)
    if not target.exists():
        errors.append(f"{label} references missing file: {reference}")


def validate_follow_up_logic(errors: list[str], question: dict[str, Any], index: int) -> None:
    logic = question.get("follow_up_logic")
    if not isinstance(logic, list):
        errors.append(f"questions[{index}].follow_up_logic must be a list.")
        return
    for rule_index, rule in enumerate(logic):
        if not isinstance(rule, dict):
            errors.append(
                f"questions[{index}].follow_up_logic[{rule_index}] must be an object."
            )
            continue
        for field in FOLLOW_UP_FIELDS:
            if field not in rule:
                errors.append(
                    f"questions[{index}].follow_up_logic[{rule_index}] missing {field}."
                )


def validate_questions(errors: list[str], data: dict[str, Any], state_path: Path) -> None:
    questions = data.get("questions")
    if not isinstance(questions, list) or not questions:
        errors.append("questions must be a non-empty list.")
        return

    ids: set[str] = set()
    active_count = 0
    for index, question in enumerate(questions):
        if not isinstance(question, dict):
            errors.append(f"questions[{index}] must be an object.")
            continue

        for field in QUESTION_FIELDS:
            if field not in question:
                errors.append(f"questions[{index}] missing required field: {field}")

        qid = question.get("id")
        if not is_non_empty_string(qid):
            errors.append(f"questions[{index}].id must be a non-empty string.")
        elif qid in ids:
            errors.append(f"Duplicate question id: {qid}")
        else:
            ids.add(qid)

        status = question.get("status")
        if status not in VALID_STATUSES:
            errors.append(
                f"questions[{index}].status must be one of: "
                + ", ".join(sorted(VALID_STATUSES))
            )
        if status == "active":
            active_count += 1

        answer_type = question.get("answer_type")
        if answer_type not in VALID_ANSWER_TYPES:
            errors.append(
                f"questions[{index}].answer_type must be one of: "
                + ", ".join(sorted(VALID_ANSWER_TYPES))
            )

        for field in ("prompt", "recommended_answer", "why_it_matters", "created_at"):
            if not is_non_empty_string(question.get(field)):
                errors.append(f"questions[{index}].{field} must be a non-empty string.")

        if not isinstance(question.get("options"), list):
            errors.append(f"questions[{index}].options must be a list.")
        if not isinstance(question.get("custom_option_enabled"), bool):
            errors.append(f"questions[{index}].custom_option_enabled must be boolean.")
        if not isinstance(question.get("research_required"), bool):
            errors.append(f"questions[{index}].research_required must be boolean.")

        check_reference(
            errors,
            state_path,
            f"questions[{index}].research_artifact",
            question.get("research_artifact"),
        )
        validate_follow_up_logic(errors, question, index)

    current_question = data.get("current_question")
    if not is_non_empty_string(current_question):
        errors.append("current_question must be a non-empty string.")
    elif current_question not in ids:
        errors.append(f"current_question does not match a question id: {current_question}")

    if active_count != 1:
        errors.append(f"Exactly one question must have status active; found {active_count}.")


def validate_artifact_lists(errors: list[str], data: dict[str, Any], state_path: Path) -> None:
    for top_key in ("decisions", "glossary", "research", "adrs"):
        if not isinstance(data.get(top_key), list):
            errors.append(f"{top_key} must be a list.")

    for index, item in enumerate(data.get("research", [])):
        if isinstance(item, dict):
            check_reference(errors, state_path, f"research[{index}].artifact", item.get("artifact"))
        else:
            errors.append(f"research[{index}] must be an object.")

    for index, item in enumerate(data.get("adrs", [])):
        if isinstance(item, dict):
            reference = item.get("path") or item.get("artifact")
            check_reference(errors, state_path, f"adrs[{index}].path", reference)
        else:
            errors.append(f"adrs[{index}] must be an object.")


def validate(data: Any, state_path: Path) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["state root must be an object."]

    missing = [key for key in TOP_LEVEL_KEYS if key not in data]
    extras = [key for key in data if key not in TOP_LEVEL_KEYS]
    if missing:
        errors.append("Missing top-level keys: " + ", ".join(missing))
    if extras:
        errors.append("Unexpected top-level keys: " + ", ".join(extras))

    for key in ("run", "project", "exports", "ui"):
        if not isinstance(data.get(key), dict):
            errors.append(f"{key} must be an object.")

    run = data.get("run", {})
    if isinstance(run, dict):
        if not is_non_empty_string(run.get("id")):
            errors.append("run.id must be a non-empty string.")
        if not is_non_empty_string(run.get("created_at")):
            errors.append("run.created_at must be a non-empty string.")

    validate_questions(errors, data, state_path)
    validate_artifact_lists(errors, data, state_path)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate questionnaire state.json.")
    parser.add_argument("state_json", help="Path to state.json")
    args = parser.parse_args()

    state_path = Path(args.state_json).expanduser().resolve()
    if not state_path.exists():
        print(f"state.json not found: {state_path}", file=sys.stderr)
        return 1

    data = load_json(state_path)
    errors = validate(data, state_path)
    result = {
        "valid": not errors,
        "errors": errors,
        "state_json": str(state_path),
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
