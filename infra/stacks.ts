import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { config } from './config'
import { S3Bucket } from './lib/constructs/s3/bucket'
import { StaticWebsiteDeployment } from './lib/constructs/s3/deployment'
import { OriginAccessIdentity } from './lib/constructs/cloudfront/origin-access-identity'
import { WebDistribution } from './lib/constructs/cloudfront/distribution'

export class AnamnotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // S3 BUCKETS

    const { bucket: websiteBucket } = new S3Bucket(this, {
      name: 'website',
      corsReadAccess: true,
    })

    new StaticWebsiteDeployment(this, {
      destinationKeyPrefix: config.projectId,
      bucket: websiteBucket,
      assetsPath: config.aws.s3.assetsPath,
    })

    // CLOUDFRONT DISTRIBUTION

    const { originAccessIdentity: websiteOAI } = new OriginAccessIdentity(this, {
      name: 'website',
    })

    new WebDistribution(this, {
      name: 'website',
      bucket: websiteBucket,
      originAccessIdentity: websiteOAI,
    })

    // PERMISSIONS

    websiteBucket.grantRead(websiteOAI)
  }
}
