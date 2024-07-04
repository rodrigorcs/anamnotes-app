import { S3Client, PutObjectCommandInput, PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadToS3 = async ({
  bucketName,
  fileKey,
  blob,
  contentType,
}: {
  bucketName: string
  fileKey: string
  blob: Blob
  contentType: string
}) => {
  const {
    VITE_AWS_ACCESS_KEY_ID: accessKeyId,
    VITE_AWS_SECRET_ACCESS_KEY: secretAccessKey,
    VITE_AWS_REGION: region,
  } = import.meta.env as Record<string, string>

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  const input: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileKey,
    Body: blob,
    ContentType: contentType,
  }

  const command = new PutObjectCommand(input)

  try {
    await s3Client.send(command)
    return `https://${command.input.Bucket}.s3.${region}.amazonaws.com/${command.input.Key}`
  } catch (err) {
    console.error('Error uploading file:', err)
  }
}
