import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'

// Función auxiliar para convertir stream a string
function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    stream.on('error', reject)
  })
}

// Inicializar el cliente de S3
const s3 = new S3Client({
  credentials: fromEnv(),
  region: process.env.AWS_REGION,
})

const bucketName = 'flm-g-paci'
const jsonKey = 'effects-config.json'

export async function GET(request) {
  try {
    // Obtener el archivo JSON de S3
    const getObjectParams = { Bucket: bucketName, Key: jsonKey }
    const { Body } = await s3.send(new GetObjectCommand(getObjectParams))
    const jsonString = await streamToString(Body)

    // Devolver una respuesta con el JSON
    return new Response(jsonString, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching JSON from S3:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
