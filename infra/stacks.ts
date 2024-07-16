import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { config } from './config'
import { S3Bucket } from './lib/constructs/s3'
import { StaticWebsiteDeployment } from './lib/constructs/s3/deployment'

export class AnamnotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const { bucket: websiteBucket } = new S3Bucket(this, {
      name: 'website',
      public: true,
    })

    new StaticWebsiteDeployment(this, {
      destinationKeyPrefix: config.projectId,
      bucket: websiteBucket,
      assetsPath: config.aws.s3.assetsPath,
    })
  }
}
