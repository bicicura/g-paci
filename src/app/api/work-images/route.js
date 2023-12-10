// import AWS from 'aws-sdk'
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import supabase from '../../../../utils/supabaseClient'

// Configuración del SDK de AWS con credenciales
const s3 = new S3Client({
  credentials: fromEnv(),
  region: process.env.AWS_REGION, // make sure AWS_REGION is set in your environment variables
})

export async function DELETE(Request) {
  const body = await Request.json()
  const imgId = body['img-id']
  const slug = body['slug']
  const fileName = body['file-name']

  const params = {
    Bucket: 'flm-g-paci',
    Key: `${slug}/${fileName}`,
  }

  try {
    await s3.send(new DeleteObjectCommand(params))
    console.log(`File ${imgId} deleted successfully from S3`)

    const { data, error } = await supabase
      .from('works_images')
      .delete()
      .match({ id: imgId })

    if (error) throw error

    console.log(`Reference to file ${imgId} deleted successfully from Supabase`, data)

    return new Response(
      JSON.stringify({ message: 'File and reference deleted successfully.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Deletion error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(Request) {
  const formData = await Request.formData()
  const files = formData.getAll('files') // Note: Changed to 'files' to match the client-side code
  const slug = formData.get('slug')
  const workId = formData.get('workId')

  if (!files.length) {
    return new Response(JSON.stringify({ error: 'No files found.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let currentOrder = 1 // Initialize the order counter
  const uploadResults = []

  for (const file of files) {
    const randomGeneratedName = generateFileName(file)
    const buffer = await file.arrayBuffer()

    const params = {
      Bucket: 'flm-g-paci',
      Key: `${slug}/${randomGeneratedName}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    }

    try {
      const { Location } = await s3.send(new PutObjectCommand(params))
      uploadResults.push({
        file_name: randomGeneratedName,
        url: Location,
        order: currentOrder++,
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  try {
    const imageUploads = await insertWorkImage({ uploadResults, workId })
    return new Response(
      JSON.stringify({ ...uploadResults, ...imageUploads, status: 'ok' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
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
      uploadResults.map(image => {
        return {
          work_id: workId,
          img: image.file_name,
          order: image.order, // This sets the order starting from 1 for the first image
        }
      })
    )
    .select()
}
