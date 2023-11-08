import AWS from 'aws-sdk'
import supabase from '../../../../utils/supabaseClient'

export async function POST(request) {
  const s3 = new AWS.S3()
  const formData = await request.formData()
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
      return { status: 'ok', file_name: randomGeneratedName, url: s3Response.Location } // Retorna el estado y la URL
    } catch (error) {
      throw new Error(error.message) // Lanza un error que será capturado más abajo
    }
  })

  try {
    // Espera a que todas las promesas de carga se resuelvan
    const uploadResults = await Promise.all(uploadPromises)

    // Inserta los registros en la tabla 'work_images'
    const imageInsertPromises = insertWorkImage({ ...uploadPromises, workId })
    await Promise.all(imageInsertPromises)

    // Retorna las URLs de los archivos subidos
    return new Response(JSON.stringify({ ...uploadResults, ...imageInsertPromises }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Maneja cualquier error que ocurra durante la carga
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

const insertWorkImage = async images => {
  console.log(images)
  return await supabase
    .from('works_images')
    .insert(images.map(image => ({ work_id: image.work_id, img: image.name })))
    .select()
}
