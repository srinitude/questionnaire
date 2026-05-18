## Summary

- 

## Validation

- [ ] `skills-ref validate "$PWD"`
- [ ] `python3 -m py_compile scripts/start-questionnaire.py scripts/validate-questionnaire-state.py`
- [ ] `python3 scripts/start-questionnaire.py --help`
- [ ] `python3 scripts/validate-questionnaire-state.py --help`
- [ ] `python3 -m json.tool evals/evals.json >/dev/null`
- [ ] `uv run --with-requirements requirements.txt python -c "import yaml; yaml.safe_load(open('references/ui-design-system.yaml'))"`
- [ ] `npx skills add "$PWD" --list`

## Notes

- 
