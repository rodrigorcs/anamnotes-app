import { Construct } from 'constructs'
import { aws_cloudfront as cf, aws_certificatemanager as acm, aws_s3 as s3 } from 'aws-cdk-lib'
import { config } from '../../../config'

interface IProps {
  name: string
  bucket: s3.Bucket
  bucketPath?: string
  originAccessIdentity: cf.OriginAccessIdentity
  certificate?: acm.ICertificate
  domainName?: string
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
      ...(props.domainName &&
        props.certificate && {
          viewerCertificate: {
            aliases: [props.domainName, `www.${props.domainName}`],
            props: {
              acmCertificateArn: props.certificate.certificateArn,
              sslSupportMethod: cf.SSLMethod.SNI,
            },
          },
        }),
      // TODO: Remove this to improve SEO
      // https://stackoverflow.com/questions/51218979/react-router-doesnt-work-in-aws-s3-bucket
      errorConfigurations: [{ errorCode: 404, responsePagePath: '/index.html', responseCode: 200 }],
    })
  }
}
