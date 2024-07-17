import { Construct } from 'constructs'
import { aws_certificatemanager as acm, Arn } from 'aws-cdk-lib'
import { config } from '../../../config'

interface IProps {
  certificateId: string
}

export class ExistingCertificate {
  public readonly certificate: acm.ICertificate

  constructor(scope: Construct, props: IProps) {
    const certificateName = `${config.projectName}-${props.certificateId.toLowerCase()}-certificate`

    const certificateARN = Arn.format({
      service: 'acm',
      resource: 'certificate',
      resourceName: props.certificateId,
      account: config.stack.env.account,
      region: config.stack.env.region,
      partition: 'aws',
    })

    this.certificate = acm.Certificate.fromCertificateArn(scope, certificateName, certificateARN)
  }
}
