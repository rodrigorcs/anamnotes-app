import { AppStage, stageValue } from './utils/env'

export const config = {
  stage: import.meta.env.STAGE as AppStage,
  isLocal: import.meta.env.DEV as boolean,
  baseURL: stageValue<string>({
    staging: 'https://www.app.staging.anamnotes.com',
    prod: 'https://www.app.anamnotes.com',
  }),
  localURL: 'http://localhost:5173',
  aws: {
    cognito: {
      domain: stageValue<string>({
        staging: 'staging-anamnotes.auth.us-east-1.amazoncognito.com',
        prod: 'anamnotes.auth.us-east-1.amazoncognito.com',
      }),
    },
  },
} as const
