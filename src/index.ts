import * as core from "@actions/core";
import { run } from "./run";

const main = async (): Promise<void> => {
  let token = core.getInput("github_token", { required: false });
  if (!token) {
    token = process.env.GITHUB_TOKEN || "";
    if (!token) {
      throw "GitHub Access Token is required";
    }
  }

  await run({
    repoOwner: core.getInput("repo_owner", { required: false }),
    repoName: core.getInput("repo_name", { required: false }),
    sha: core.getInput("sha", { required: false }),
    context: core.getInput("context", { required: false }),
    githubToken: token,
    state: getState(core.getInput("state", { required: true })),
  });
};

main().catch((e) =>
  core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
);

function getState(state: string): string {
  switch (state) {
    case "error":
    case "failure":
    case "pending":
    case "success":
      return state;
    case "cancelled":
      return "failure";
    default:
      throw `state ${state} is invalid`;
  }
}
