import { Construct } from 'constructs'
import { RemovalPolicy, aws_s3 as s3, aws_iam as iam } from 'aws-cdk-lib'
import { config } from '../../../config'
import { stageValue } from '../../utils'
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3'

interface IProps {
  name: string
  encryption?: boolean
  corsReadAccess?: boolean
}

export class S3Bucket {
  public readonly bucket: s3.Bucket
  public readonly apiGwProxyRole: iam.Role

  constructor(scope: Construct, props: IProps) {
    const bucketName = `${config.projectName}-${props.name}-bucket`

    this.bucket = new s3.Bucket(scope, bucketName, {
      versioned: stageValue({ staging: false, prod: true }),
      bucketName,
      eventBridgeEnabled: true,
      publicReadAccess: false,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: stageValue({ staging: true, prod: false }),
      removalPolicy: stageValue({ staging: RemovalPolicy.DESTROY, prod: RemovalPolicy.RETAIN }),
      encryption: props.encryption ? s3.BucketEncryption.S3_MANAGED : undefined,
      cors: props.corsReadAccess
        ? [
            {
              allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
              allowedOrigins: ['*'],
              allowedHeaders: ['*'],
              maxAge: 300,
            },
          ]
        : undefined,
    })
  }
}
