import * as path from 'path'
import * as dotenv from 'dotenv'
import { getDeploymentStage, stageValue, validateEnv } from './lib/utils'
import { REQUIRED_ENV_VARIABLES } from './lib/types'

dotenv.config({
  path: path.resolve(__dirname, `./.env.${getDeploymentStage(process.env.STAGE)}`),
})

export const requiredEnvs: Array<keyof REQUIRED_ENV_VARIABLES> = [
  'CDK_DEFAULT_ACCOUNT',
  'AWS_DEFAULT_REGION',
  'DEPLOYED_BY',
  'STAGE',
]

const validatedEnvs = validateEnv(requiredEnvs, process.env)

const stage = getDeploymentStage(validatedEnvs.STAGE)

const projectId = 'anamnotes-app' as const
const projectName = `${stage}-${projectId}` as const
const ssmParametersRoot = `/${stage}/${projectId}` as const

export const config = {
  projectId,
  projectName,
  stage,
  aws: {
    s3: {
      assetsPath: '../dist',
    },
    route53: {
      hostedZoneId: stageValue<string>({
        staging: 'Z03723123I6T44W2QOSIN',
        prod: 'Z0448513YG2VMTOLT2NK',
      }),
      domainName: stageValue<string>({
        staging: 'staging.anamnotes.com',
        prod: 'anamnotes.com',
      }),
    },
  },
  stack: {
    env: {
      account: validatedEnvs.CDK_DEFAULT_ACCOUNT,
      region: validatedEnvs.AWS_DEFAULT_REGION,
    },
  },
  deployedBy: process.env.DEPLOYED_BY || 'Github',
  validatedEnvs,
  githubRepo: 'rodrigorcs/anamnotes-app',
} as const
