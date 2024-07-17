import { Construct } from 'constructs'
import {
  aws_cloudfront as cf,
  aws_route53 as r53,
  aws_route53_targets as r53Targets,
} from 'aws-cdk-lib'
import { config } from '../../../config'

interface IProps {
  cfDistribution: cf.CloudFrontWebDistribution
  hostedZoneId: string
  domainName: string
}

export class ARecord {
  public readonly aRecord: r53.ARecord

  constructor(scope: Construct, props: IProps) {
    const hostedZone = r53.PublicHostedZone.fromHostedZoneAttributes(
      scope,
      `${config.projectName}-hosted-zone`,
      {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.domainName,
      },
    )

    this.aRecord = new r53.ARecord(scope, `${config.projectName}-cf-a-record`, {
      recordName: 'app',
      target: r53.RecordTarget.fromAlias(new r53Targets.CloudFrontTarget(props.cfDistribution)),
      zone: hostedZone,
    })
  }
}
