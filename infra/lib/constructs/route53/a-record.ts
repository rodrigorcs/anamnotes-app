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
  hostedZone?: r53.IHostedZone
}

// This doesn't always work, need to check in AWS Console if the A records are created
// If not, try to create them manually in the AWS Console
export class ARecord {
  public readonly aRecord: r53.ARecord

  constructor(scope: Construct, props: IProps) {
    let hostedZone

    if (props.hostedZone) {
      hostedZone = props.hostedZone
    } else {
      hostedZone = r53.PublicHostedZone.fromHostedZoneAttributes(
        scope,
        `${config.projectName}-hosted-zone`,
        {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.domainName,
        },
      )
    }

    const aRecordId = `${config.projectName}-${props.domainName.split('.').join('-')}-a-record`

    this.aRecord = new r53.ARecord(scope, aRecordId, {
      recordName: props.domainName,
      target: r53.RecordTarget.fromAlias(new r53Targets.CloudFrontTarget(props.cfDistribution)),
      zone: hostedZone,
    })
  }
}

interface IGroupedARecordsProps extends Omit<IProps, 'domainName'> {
  domainNames: string[]
  hostedZoneName: string
}

export class GroupedARecords {
  public readonly aRecords: r53.ARecord[] = []

  constructor(scope: Construct, props: IGroupedARecordsProps) {
    const hostedZone = r53.PublicHostedZone.fromHostedZoneAttributes(
      scope,
      `${config.projectName}-hosted-zone`,
      {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.hostedZoneName,
      },
    )

    for (const domainName of props.domainNames) {
      const { aRecord } = new ARecord(scope, {
        ...props,
        domainName,
        hostedZone,
      })

      this.aRecords.push(aRecord)
    }
  }
}
