import { Construct } from 'constructs'
import { aws_s3 as s3, aws_s3_deployment as s3Deployment } from 'aws-cdk-lib'
import { config } from '../../../config'

interface IStaticWebSiteDeploymentProps {
  destinationKeyPrefix: string
  bucket: s3.IBucket
  assetsPath: string
}

/**
 *  Deploys Static files into S3 bucket
 */
export class StaticWebsiteDeployment {
  constructor(scope: Construct, props: IStaticWebSiteDeploymentProps) {
    new s3Deployment.BucketDeployment(scope, `${config.projectName}-static-website-deployment`, {
      sources: [s3Deployment.Source.asset(props.assetsPath)],
      destinationKeyPrefix: props.destinationKeyPrefix,
      destinationBucket: props.bucket,
    })
  }
}
