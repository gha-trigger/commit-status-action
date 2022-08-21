# update-commit-status-action

GitHub Actions to update commit status according to job results

## Example

```yaml
jobs:
  foo:
    runs-on: ubuntu-latest
    steps:
      # Start pending
      - uses: suzuki-shunsuke/update-commit-status-action@main
        with:
          repo_owner: suzuki-shunsuke
          repo_name: test-github-action
          sha: fae4b30052b48f38129f98dfc0bf3bae470eaf01
          github_token: ${{ secrets.PERSONAL_GITHUB_TOKEN }}

      - run: sleep 20
      - run: exit 1

      - uses: suzuki-shunsuke/update-commit-status-action@main
        if: always()
        with:
          repo_owner: suzuki-shunsuke
          repo_name: test-github-action
          sha: fae4b30052b48f38129f98dfc0bf3bae470eaf01
          state: ${{ job.status }}
        env:
          GITHUB_TOKEN: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
```

## Inputs

### Required

| name       | description      |
| ---------- | ---------------- |
| repo_owner | Repository Owner |
| repo_name  | Repository Name  |
| sha        | Commit hash      |

### Optional

| name         | default                                                                 | description                                                                                                  |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| github_token | `github.token`,                                                         | GitHub Access Token                                                                                          |
| context      |                                                                         | A string label to differentiate this status from the status of other systems. This field is case-insensitive |
| state        | 'pending'                                                               | The state of the status. Can be one of: `error`, `failure`, `pending`, `success`, `cancelled`                |
| target_url   | `https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` | target url                                                                                                   |

## Environment variables

- `GITHUB_TOKEN`: GitHub Access Token

## Outputs

Nothing.

## LICENSE

[MIT](LICENSE)
