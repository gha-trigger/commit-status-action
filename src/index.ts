import * as core from "@actions/core";
import { run } from "./run";

const main = async (): Promise<void> => {
  await run({
    repoOwner: core.getInput("repo_owner", { required: false }),
    repoName: core.getInput("repo_name", { required: false }),
    sha: core.getInput("sha", { required: false }),
    context: core.getInput("context", { required: false }),
    githubToken: getToken(),
    state: getState(core.getInput("state", { required: true })),
    targetURL: getTargetURL(),
  });
};

main().catch((e) =>
  core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
);

function getState(state: string): "error" | "failure" | "pending" | "success" {
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

function getToken(): string {
  let token = core.getInput("github_token", { required: false });
  if (token) {
    return token;
  }
  token = process.env.GITHUB_TOKEN || "";
  if (token) {
    return token;
  }
  throw "GitHub Access Token is required";
}

function getTargetURL(): string {
  let targetURL = core.getInput("target_url", { required: false });
  if (targetURL) {
    return targetURL;
  }
  return `https://github.com/${
    process.env.GITHUB_REPOSITORY || ""
  }/actions/runs/${process.env.GITHUB_RUN_ID || ""}`;
}
