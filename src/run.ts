import * as github from "@actions/github";
import * as core from "@actions/core";

type Envs = {
  repoOwner: string;
  repoName: string;
  sha: string;
  githubToken: string;
  targetURL: string;
  isWorkflow: boolean;
};

export function newEnvs(): Envs {
  return {
    repoOwner: process.env.GHA_REPOSITORY_OWNER || "",
    repoName: process.env.GHA_REPOSITORY_NAME || "",
    sha: process.env.GHA_COMMIT_STATUS_SHA || "",
    githubToken: process.env.GITHUB_TOKEN || "",
    isWorkflow: process.env.GHA_WORKFLOW_COMMIT_STATUS ? true : false,
    targetURL: `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${
      process.env.GITHUB_REPOSITORY || ""
    }/actions/runs/${process.env.GITHUB_RUN_ID || ""}`,
  };
}

export function newInputs(): Inputs {
  return {
    repoOwner: core.getInput("repo_owner"),
    repoName: core.getInput("repo_name"),
    sha: core.getInput("sha"),
    context: core.getInput("context"),
    githubToken: core.getInput("github_token"),
    state: getState(core.getInput("state")),
    needs: core.getInput("needs"),
    updateCommitStatus: core.getBooleanInput("update_commit_status"),
    targetURL: core.getInput("target_url"),
  };
}

type Inputs = {
  repoOwner: string;
  repoName: string;
  sha: string;
  context: string;
  githubToken: string;
  state: "error" | "failure" | "pending" | "success" | "";
  needs: string;
  targetURL: string;
  updateCommitStatus: boolean;
};

function updateInputsWithEnvs(inputs: Inputs, envs: Envs) {
  if (!inputs.repoOwner) {
    inputs.repoOwner = envs.repoOwner;
  }
  if (!inputs.repoName) {
    inputs.repoName = envs.repoName;
  }
  if (!inputs.sha) {
    inputs.sha = envs.sha;
  }
  if (!inputs.githubToken) {
    inputs.githubToken = envs.githubToken;
  }
  if (!inputs.targetURL) {
    inputs.targetURL = envs.targetURL;
  }
}

function validateInputs(inputs: Inputs) {
  if (!inputs.repoOwner) {
    throw `repo_owner is required`;
  }
  if (!inputs.repoName) {
    throw `repo_name is required`;
  }
  if (!inputs.repoName) {
    throw `repo_name is required`;
  }
  if (!inputs.sha) {
    throw `sha is required`;
  }
}

export const run = async (inputs: Inputs, envs: Envs): Promise<void> => {
  updateInputsWithEnvs(inputs, envs);
  validateInputs(inputs);

  const octokit = github.getOctokit(inputs.githubToken);

  if (envs.isWorkflow) {
    inputs.context = `${github.context.workflow} / (${github.context.eventName})`;
  } else {
    inputs.context = `${github.context.workflow} / ${github.context.job} (${github.context.eventName})`;
  }

  if (envs.isWorkflow) {
    if (!inputs.updateCommitStatus) {
      core.info("Skip updating a commit status");
      return;
    }
    if (inputs.needs) {
      inputs.state = getStatusFromNeedsContext(inputs.needs);
    } else {
      inputs.state = getState(inputs.state);
    }
  } else {
    inputs.state = getState(inputs.state);
  }

  if (inputs.state == "") {
    throw `state is required`;
  }

  core.info(
    `Updating a commit status owner=${inputs.repoOwner} repo=${inputs.repoName} sha=${inputs.sha} state=${inputs.state} context=${inputs.context} target_url=${inputs.targetURL}`
  );
  await octokit.rest.repos.createCommitStatus({
    owner: inputs.repoOwner,
    repo: inputs.repoName,
    sha: inputs.sha,
    target_url: inputs.targetURL,

    state: inputs.state,
    context: inputs.context,
  });
};

function getState(
  state: string
): "error" | "failure" | "pending" | "success" | "" {
  switch (state) {
    case "error":
    case "failure":
    case "pending":
    case "success":
      return state;
    case "cancelled":
      return "failure";
    case "":
      return "";
    default:
      throw `state ${state} is invalid`;
  }
}

type Need = {
  result: string;
};

function getStatusFromNeedsContext(
  needsStr: string
): "error" | "failure" | "pending" | "success" {
  // https://docs.github.com/en/actions/learn-github-actions/contexts#needs-context
  // needs.<job_id>.result
  const needs = JSON.parse(needsStr) as Record<string, Need>;
  for (const jobID in needs) {
    const need = needs[jobID];
    const result = need.result;
    switch (result) {
      // success, failure, cancelled, or skipped
      case "success":
      case "skipped":
      case "failure":
        return "failure";
      case "cancelled":
        return "failure";
      default:
        throw `result ${result} is invalid`;
    }
  }
  return "success";
}
