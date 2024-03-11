import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import { BUCKET_NAME } from '../../../../constants'

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

const jsonKey = 'effects-config.json'

const getEffectsConfigJSON = async () => {
  // Obtener el archivo JSON actual de S3
  const getObjectParams = { Bucket: BUCKET_NAME, Key: jsonKey }
  const { Body } = await s3.send(new GetObjectCommand(getObjectParams))
  const jsonString = await streamToString(Body)
  return JSON.parse(jsonString)
}

export async function POST(request) {
  try {
    const { effectName, newEffectState, imageUrl, client, isPrimary } =
      await request.json()

    const json = await getEffectsConfigJSON()

    // Modificar el JSON
    const effectConfig = json.effects[effectName]
    if (effectConfig) {
      effectConfig.active = newEffectState
      if (imageUrl && client) {
        effectConfig.images.push({ url: imageUrl, isPrimary, client })
        // le asigno un ID a cada item en base a su index
        effectConfig.images = effectConfig.images.map((item, index) => {
          return { ...item, id: index }
        })
      }
    }

    // Sobrescribir el archivo JSON en S3
    const putObjectParams = {
      Bucket: BUCKET_NAME,
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

export async function DELETE(request) {
  try {
    const { imgID } = await request.json()
    const json = await getEffectsConfigJSON()

    // Encuentra el índice del elemento con el imgID en el arreglo de ImgSlideEffect
    const index = json.effects.ImgSlideEffect.images.findIndex(
      image => image.id === imgID
    )

    if (index === -1) {
      throw new Error('Image with provided ID not found.')
    }

    // Extrae la URL y elimina el elemento del JSON
    const imageUrl = json.effects.ImgSlideEffect.images[index].url
    json.effects.ImgSlideEffect.images.splice(index, 1)

    // Extrae el nombre del archivo de la URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    // Elimina el archivo de S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `home-effect/${fileName}`, // Asegúrate de que esta ruta sea correcta.
      })
    )

    // Sobrescribe el JSON modificado en S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: jsonKey,
        Body: JSON.stringify(json, null, 2),
        ContentType: 'application/json',
      })
    )

    return new Response(
      JSON.stringify({ message: 'Image and file deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error deleting image:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
