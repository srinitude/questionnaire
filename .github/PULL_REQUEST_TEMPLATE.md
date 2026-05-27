## Summary

- 

## Validation

- [ ] `skills-ref validate "$PWD/skills/questionnaire"`
- [ ] `python3 -m py_compile skills/questionnaire/scripts/start-questionnaire.py skills/questionnaire/scripts/validate-questionnaire-state.py`
- [ ] `python3 skills/questionnaire/scripts/start-questionnaire.py --help`
- [ ] `python3 skills/questionnaire/scripts/validate-questionnaire-state.py --help`
- [ ] `python3 -m json.tool skills/questionnaire/evals/evals.json >/dev/null`
- [ ] `uv run --with-requirements skills/questionnaire/requirements.txt python -c "import yaml; yaml.safe_load(open('skills/questionnaire/references/ui-design-system.yaml'))"`
- [ ] `npx skills add "$PWD" --list`

## Notes

- 
