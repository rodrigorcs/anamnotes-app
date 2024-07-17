import { Construct } from 'constructs'
import { aws_cloudfront as cf } from 'aws-cdk-lib'
import { config } from '../../../config'

interface IProps {
  name: string
}

export class OriginAccessIdentity {
  public readonly originAccessIdentity: cf.OriginAccessIdentity

  constructor(scope: Construct, props: IProps) {
    const oaiName = `${config.projectName}-${props.name}-oai`

    this.originAccessIdentity = new cf.OriginAccessIdentity(scope, oaiName)
  }
}
