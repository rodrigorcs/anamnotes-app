import { Construct } from 'constructs'
import { aws_cloudfront as cf, aws_s3 as s3 } from 'aws-cdk-lib'
import { config } from '../../../config'

interface IProps {
  name: string
  bucket: s3.Bucket
  bucketPath?: string
  originAccessIdentity: cf.OriginAccessIdentity
}

export class WebDistribution {
  public readonly webDistribution: cf.CloudFrontWebDistribution

  constructor(scope: Construct, props: IProps) {
    const distributionName = `${config.projectName}-${props.name}-web-distribution`

    this.webDistribution = new cf.CloudFrontWebDistribution(scope, distributionName, {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: props.bucket,
            originPath: props.bucketPath,
            originAccessIdentity: props.originAccessIdentity,
          },
          behaviors: [
            { isDefaultBehavior: true },
            { pathPattern: '/*', allowedMethods: cf.CloudFrontAllowedMethods.GET_HEAD },
          ],
        },
      ],
    })
  }
}
