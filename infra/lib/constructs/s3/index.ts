import { Construct } from 'constructs'
import { RemovalPolicy, aws_s3 as s3, aws_iam as iam } from 'aws-cdk-lib'
import { config } from '../../../config'
import { stageValue } from '../../utils'
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import { StarPrincipal } from 'aws-cdk-lib/aws-iam'

interface IS3BucketProps {
  name: string
  public?: boolean
  encryption?: boolean
  corsConfig?: s3.CorsRule[]
}

export class S3Bucket {
  public readonly bucket: s3.Bucket
  public readonly apiGwProxyRole: iam.Role

  constructor(scope: Construct, props: IS3BucketProps) {
    const bucketName = `${config.projectName}-${props.name}-bucket`

    this.bucket = new s3.Bucket(scope, bucketName, {
      versioned: false,
      bucketName,
      eventBridgeEnabled: true,
      publicReadAccess: false,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: props.public
        ? {
            blockPublicAcls: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
            blockPublicPolicy: false,
          }
        : BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: stageValue({ staging: true, prod: false }),
      removalPolicy: stageValue({ staging: RemovalPolicy.DESTROY, prod: RemovalPolicy.RETAIN }),
      encryption: props.encryption ? s3.BucketEncryption.S3_MANAGED : undefined,
      cors: props.corsConfig,
    })

    if (props.public) {
      this.bucket.addToResourcePolicy(
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          effect: iam.Effect.ALLOW,
          principals: [new StarPrincipal()],
          resources: [this.bucket.arnForObjects('*')],
        }),
      )
    }
  }
}
