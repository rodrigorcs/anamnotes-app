import { CfnOutput, Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { config } from './config'
import { S3Bucket } from './lib/constructs/s3/bucket'
import { StaticWebsiteDeployment } from './lib/constructs/s3/deployment'
import { OriginAccessIdentity } from './lib/constructs/cloudfront/origin-access-identity'
import { WebDistribution } from './lib/constructs/cloudfront/distribution'
import { GroupedARecords } from './lib/constructs/route53/a-record'
import { ExistingCertificate } from './lib/constructs/acm/certificate'

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

    // ACM CERTIFICATE

    const { certificate: acmCertificate } = new ExistingCertificate(this, {
      certificateId: config.aws.acm.certificateId,
    })

    // CLOUDFRONT DISTRIBUTION

    const { originAccessIdentity: websiteOAI } = new OriginAccessIdentity(this, {
      name: 'website',
    })

    const { webDistribution: websiteDistribution } = new WebDistribution(this, {
      name: 'website',
      bucket: websiteBucket,
      bucketPath: `/${config.projectId}`,
      originAccessIdentity: websiteOAI,
      certificate: acmCertificate,
      domainName: config.aws.route53.domainName,
    })

    // ROUTE53

    new GroupedARecords(this, {
      cfDistribution: websiteDistribution,
      domainNames: [config.aws.route53.domainName, `www.${config.aws.route53.domainName}`],
      hostedZoneName: config.aws.route53.domainName,
      hostedZoneId: config.aws.route53.hostedZoneId,
    })

    // PERMISSIONS

    websiteBucket.grantRead(websiteOAI)

    // OUTPUTS

    new CfnOutput(this, 'CloudfrontDistributionId', {
      value: websiteDistribution.distributionId,
      description: 'Cloudfront Distribution ID for Anamnotes App Website',
    })
  }
}
