import * as github from "@actions/github";

type Inputs = {
  repoOwner: string;
  repoName: string;
  sha: string;
  context: string;
  githubToken: string;
  state: string;
};

export const run = async (inputs: Inputs): Promise<void> => {
  const octokit = github.getOctokit(inputs.githubToken);
  await octokit.rest.repos.createCommitStatus({
    owner: inputs.repoOwner,
    repo: inputs.repoName,
    sha: inputs.sha,
    state: "pending",
    context: inputs.context,
  });
};
