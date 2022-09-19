# commit-status-action

GitHub Actions to update commit status according to job results

## Example

```yaml
jobs:
  foo:
    runs-on: ubuntu-latest
    steps:
      # Start pending
      - uses: gha-trigger/commit-status-action@main
        with:
          github_token: ${{secrets.PERSONAL_GITHUB_TOKEN}}

      - run: sleep 20
      - run: exit 1

      - uses: gha-trigger/commit-status-action@main
        if: always()
        with:
          state: ${{job.status}}
        env:
          GITHUB_TOKEN: ${{secrets.PERSONAL_GITHUB_TOKEN}}
```

## Inputs

### Required

name | description
--- | ---
github_token (`$GITHUB_TOKEN`) | GitHub Access Token

### Optional

- repo_owner (`$GHA_REPOSITORY_OWNER`): Repository Owner
- repo_name (`$GHA_REPOSITORY_NAME`): Repository Name
- sha (`$GHA_COMMIT_STATUS_SHA`): Updated commit hash
- state (`pending`): The state of the status. Can be one of: `error`, `failure`, `pending`, `success`, `cancelled`
- context (`${{ github.workflow }} / ${{ github.job }} (${{ github.event_name }})` or `${{ github.workflow }} (${{ github.event_name }})`)
- target_url (`${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`): Target URL
- needs: [needs context](https://docs.github.com/en/actions/learn-github-actions/contexts#needs-context)
- update_commit_status (boolean): If `true`, a commit status is updated

## Environment variables

- `GHA_WORKFLOW_COMMIT_STATUS `: `true` or `false`. If `true`, the commit status is updated per workflow, otherwise the commit status is updated per job

## Outputs

Nothing.

## LICENSE

[MIT](LICENSE)
