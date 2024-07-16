export enum GithubBranch {
  STAGING = 'staging',
  PRODUCTION = 'main',
}

export enum AppStage {
  STAGING = 'staging',
  PRODUCTION = 'prod',
}

export enum AppStageProfiles {
  PRODUCTION = 'anamnotes-prod',
  STAGING = 'anamnotes-staging',
}

export enum DeploymentEnvironments {
  LOCAL = 'local',
  CI = 'CI',
}

export enum HttpMethods {
  OPTIONS = 'OPTIONS',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum LambdaMetricActions {
  SUCCEEDED = 'succeeded',
  ERRORED = 'errored',
  FAULTED = 'faulted',
  THROTTLED = 'throttled',
}
