// pages/api/s3-presigned-url.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { fromEnv } from '@aws-sdk/credential-provider-env'

export async function POST(request) {
  try {
    const { fileName, fileType, slug } = await request.json()
    const region = process.env.AWS_REGION
    const bucket = 'flm-g-paci' // Replace with your actual bucket name
    const key = `${slug}/${fileName}`

    const s3Client = new S3Client({
      region,
      credentials: fromEnv(),
    })

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return new Response(JSON.stringify({ signedUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating pre-signed URL', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
