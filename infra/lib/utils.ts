import { REQUIRED_ENV_VARIABLES, ENV_VARIABLES, SetAppStageProfile } from './types'
import { AppStage, AppStageProfiles, GithubBranch } from './enums'

export const setAppStageProfile: SetAppStageProfile = {
  prod: AppStageProfiles.PRODUCTION,
  staging: AppStageProfiles.STAGING,
}

export const getDeploymentStage = (githubBranch: string | undefined): AppStage => {
  if (githubBranch === GithubBranch.PRODUCTION) {
    return AppStage.PRODUCTION
  }
  if (githubBranch === GithubBranch.STAGING) {
    return AppStage.STAGING
  }

  throw new Error(`Invalid STAGE detected`)
}

export const validateEnv = (
  requiredEnvs: Array<keyof REQUIRED_ENV_VARIABLES>,
  env: { [key: string]: string | undefined },
): ENV_VARIABLES => {
  requiredEnvs.forEach((requiredEnv: string) => {
    if (!env[requiredEnv]) {
      throw new Error(`${requiredEnv} required`)
    }
  })

  return env as ENV_VARIABLES
}

export const isBoolean = (val: unknown): boolean => 'boolean' === typeof val

export const stageValue = <T>(stageObj: { [key in AppStage]: T }): T => {
  const stage = process.env.STAGE as AppStage
  if (!stage) throw new Error(`No stage found in the environment variables`)

  const stageValue = stageObj[stage]

  return stageValue
}
