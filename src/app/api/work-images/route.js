// import AWS from 'aws-sdk'
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import supabase from '../../../../utils/supabaseClient'
import { BUCKET_NAME } from '../../../../constants'

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
    Bucket: BUCKET_NAME,
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
  try {
    const body = await Request.json()
    const fileDetailsArray = body.files // Expecting an array of file details
    const workId = body.workId

    if (!fileDetailsArray || fileDetailsArray.length === 0) {
      return new Response(JSON.stringify({ error: 'No file data provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Insert file metadata into 'works_images' table in Supabase
    const { data, error } = await supabase.from('works_images').insert(
      fileDetailsArray.map(file => ({
        work_id: workId,
        img: file.fileName, // Assuming this contains the random file name
        // url: file.fileUrl, // The URL of the file in S3
        order: file.order, // Order of the file
      }))
    )

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ data, status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error during database operation:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

const insertWorkImage = async ({ uploadResults, workId }) => {
  return await supabase
    .from('works_images')
    .insert(
      uploadResults.map(image => {
        return {
          work_id: workId,
          img: image.file_name,
          order: image.order,
        }
      })
    )
    .select()
}
