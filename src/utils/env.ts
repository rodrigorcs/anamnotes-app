export enum AppStage {
  STAGING = 'staging',
  PRODUCTION = 'prod',
}

export const stageValue = <T>(stageObj: { [key in AppStage]: T }): T => {
  const stage = import.meta.env.VITE_STAGE as AppStage
  if (!stage) throw new Error(`No stage found in the environment variables`)

  const stageValue = stageObj[stage]

  return stageValue
}
