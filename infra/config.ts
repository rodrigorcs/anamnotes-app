import * as path from 'path'
import * as dotenv from 'dotenv'
import { stageValue, validateEnv } from './lib/utils'
import { REQUIRED_ENV_VARIABLES } from './lib/types'

dotenv.config({
  path: path.resolve(__dirname, `./.env.${process.env.STAGE}`),
})

export const requiredEnvs: Array<keyof REQUIRED_ENV_VARIABLES> = [
  'CDK_DEFAULT_ACCOUNT',
  'AWS_DEFAULT_REGION',
  'DEPLOYED_BY',
  'STAGE',
]

const validatedEnvs = validateEnv(requiredEnvs, process.env)

const stage = validatedEnvs.STAGE

const projectId = 'anamnotes-app' as const
const projectName = `${stage}-${projectId}` as const
const ssmParametersRoot = `/${stage}/${projectId}` as const

export const config = {
  projectId,
  projectName,
  stage,
  aws: {
    acm: {
      certificateId: stageValue<string>({
        staging: 'a97318e4-e07d-4d8d-8892-01daf5c3367a',
        prod: 'e3750459-4261-463f-ba63-243923a6afb6',
      }),
    },
    route53: {
      hostedZoneId: stageValue<string>({
        staging: 'Z03723123I6T44W2QOSIN',
        prod: 'Z0448513YG2VMTOLT2NK',
      }),
      domainName: stageValue<string>({
        staging: 'staging.anamnotes.com',
        prod: 'app.anamnotes.com',
      }),
    },
    s3: {
      assetsPath: '../dist',
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
