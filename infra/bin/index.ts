#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { AnamnotesAppStack } from '../stacks'
import { config } from '../config'
import { stageValue } from '../lib/utils'

export const createStack = (app: App) =>
  new AnamnotesAppStack(app, `${config.projectName}-stack`, {
    env: config.stack.env,
    description: `Resources for ${config.stage} Anamnotes app`,
    terminationProtection: stageValue({
      prod: false, // Update to true when ready for production
      staging: false,
    }),
    tags: {
      Project: config.projectName,
      DeployedBy: config.deployedBy,
      GithubRepo: config.githubRepo,
    },
  })

/**
 * We use an async function to initialize the CDK App so that we can make asynchronous calls to
 * the AWS SDK to get any information we need before deploying the CDK instead of using the CDK provided
 * context resolution to get that information
 */
export const createApp = () => {
  const app = new App()

  const stack = createStack(app)

  return { app, stack }
}

if (process.env.NODE_ENV !== 'test') createApp()
