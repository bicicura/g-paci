import AWS from 'aws-sdk'
import supabase from '../../../../utils/supabaseClient'

// Configuración del SDK de AWS con credenciales
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export async function DELETE(Request) {
  const body = await Request.json()
  const imgId = body['img-id']
  const slug = body['slug']
  const fileName = body['file-name']

  const s3 = new AWS.S3()

  // Eliminar el archivo de S3
  const params = {
    Bucket: 'flm-g-paci',
    Key: `${slug}/${fileName}`, // Asegúrate de que el Key sea correcto
  }

  try {
    // Intenta eliminar el archivo de S3
    await s3.deleteObject(params).promise()
    console.log(`File ${imgId} deleted successfully from S3`)

    // Intenta eliminar la referencia en Supabase
    const { data, error } = await supabase
      .from('works_images')
      .delete()
      .match({ id: imgId })

    if (error) {
      throw error
    }

    console.log(`Reference to file ${imgId} deleted successfully from Supabase`, data)

    // Si todo fue bien, envía una respuesta exitosa
    return new Response(
      JSON.stringify({ message: 'File and reference deleted successfully.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Deletion error:', error)
    // Si hubo un error, envía una respuesta de error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(Request) {
  const s3 = new AWS.S3()
  const formData = await Request.formData()
  const files = formData.getAll('file') // Obtiene todos los archivos de FormData
  const slug = formData.get('slug')
  const workId = formData.get('workId')

  if (!files.length) {
    return new Response(JSON.stringify({ error: 'No files found.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const uploadPromises = files.map(async file => {
    const randomGeneratedName = generateFileName(file)
    // Lee el archivo como buffer
    const buffer = await file.arrayBuffer()

    // Configura los parámetros de carga
    const params = {
      Bucket: 'flm-g-paci',
      Key: `${slug}/${randomGeneratedName}`, // Asegúrate de que el nombre del archivo sea único
      Body: Buffer.from(buffer), // Convierte el arrayBuffer a Buffer
      ContentType: file.type,
    }

    try {
      // Realiza la carga a S3
      const s3Response = await s3.upload(params).promise()
      return { file_name: randomGeneratedName, url: s3Response.Location } // Retorna el estado y la URL
    } catch (error) {
      throw new Error(error.message) // Lanza un error que será capturado más abajo
    }
  })

  try {
    // Espera a que todas las promesas de carga se resuelvan
    const uploadResults = await Promise.all(uploadPromises)
    console.log(uploadResults)

    // Inserta los registros en la tabla 'work_images'
    const imageUploads = await insertWorkImage({ uploadResults, workId })

    // Retorna las URLs de los archivos subidos
    return new Response(
      JSON.stringify({ ...uploadResults, ...imageUploads, status: 'ok' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    // Maneja cualquier error que ocurra durante la carga
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function generateFileName(file) {
  // Extrae la extensión del archivo del nombre original del archivo
  const extension = file.name.split('.').pop()
  const randomName = (Math.random() + 1).toString(36).substring(2)
  return `${randomName}.${extension}`
}

// --------------------------------------------------------------
// ESTOY POR ACA QUIERO DARLE EL ORDER CORRESPONDIENTE A CADA IMG
// --------------------------------------------------------------
const insertWorkImage = async ({ uploadResults, workId }) => {
  return await supabase
    .from('works_images')
    .insert(
      uploadResults.map((image, index) => {
        return {
          work_id: workId,
          img: image.file_name,
          order: index,
        }
      })
    )
    .select()
}
