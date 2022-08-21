# update-commit-status-action

GitHub Actions to update commit status according to job results

## Example

```yaml
- uses: suzuki-shunsuke/update-commit-status-action@main
  with:
    repo_owner: suzuki-shunsuke
    repo_name: tfcmt
    sha: xxx
    context: ${{ env.GITHUB_JOB }}
    github_token: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
# Other steps
- uses: suzuki-shunsuke/update-commit-status-action@main
  if: always()
  with:
    repo_owner: suzuki-shunsuke
    repo_name: tfcmt
    sha: xxx
    context: ${{ env.GITHUB_JOB }}
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

| name         | default         | description                                                                                                  |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------ |
| github_token | `github.token`, | GitHub Access Token                                                                                          |
| context      |                 | A string label to differentiate this status from the status of other systems. This field is case-insensitive |
| state        | 'pending'       | The state of the status. Can be one of: `error`, `failure`, `pending`, `success`, `cancelled`                |

## Environment variables

- `GITHUB_TOKEN`: GitHub Access Token

## Outputs

Nothing.

## LICENSE

[MIT](LICENSE)
