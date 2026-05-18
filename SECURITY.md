# Security Policy

## Supported Versions

Security fixes are handled on the latest released version.

## Reporting a Vulnerability

If you find a vulnerability, please avoid posting secrets, exploit details, private screenshots, credentials, or proprietary reference data in a public issue.

Use GitHub's private vulnerability reporting or contact the maintainer through the repository owner profile. If the concern is not sensitive, open a GitHub issue with enough detail to reproduce the problem.

Reports should include:

- Affected files or commands.
- Expected and actual behavior.
- Reproduction steps.
- Any relevant environment details.

## Scope

Security-sensitive areas include:

- Script behavior in `scripts/`.
- Questionnaire state validation bypasses.
- Instructions that could encourage disclosure of private project context, local files, questionnaire transcripts, or credentials.
- Installability and package metadata that could mislead users about what the skill does.
