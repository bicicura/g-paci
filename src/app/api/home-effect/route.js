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

// Función para manejar solicitudes GET
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

export async function POST(request) {
  try {
    const { effectName, newEffectState, primaryImageUrl, secondaryImageUrl } =
      await request.json()

    // Obtener el archivo JSON actual de S3
    const getObjectParams = { Bucket: bucketName, Key: jsonKey }
    const { Body } = await s3.send(new GetObjectCommand(getObjectParams))
    const jsonString = await streamToString(Body)
    const json = JSON.parse(jsonString)

    // Modificar el JSON
    const effectConfig = json.effects[effectName]
    if (effectConfig) {
      effectConfig.active = newEffectState
      if (primaryImageUrl) effectConfig.primaryImage = primaryImageUrl
      if (secondaryImageUrl) effectConfig.secondaryImage = secondaryImageUrl
    }

    // Sobrescribir el archivo JSON en S3
    const putObjectParams = {
      Bucket: bucketName,
      Key: jsonKey,
      Body: JSON.stringify(json, null, 2), // Formatear para mejor legibilidad
      ContentType: 'application/json',
    }
    await s3.send(new PutObjectCommand(putObjectParams))

    // Devolver una respuesta exitosa
    return new Response(JSON.stringify({ message: 'Effect updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating effect:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
