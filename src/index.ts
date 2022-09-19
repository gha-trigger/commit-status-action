import * as core from '@actions/core';
import { run, newInputs, newEnvs } from './run';

const main = async (): Promise<void> => {
  await run(newInputs(), newEnvs());
};

main().catch((e) =>
  core.setFailed(e instanceof Error ? e.message : JSON.stringify(e))
);
