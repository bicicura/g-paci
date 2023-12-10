import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import supabase from '../../../../utils/supabaseClient'

// Initialize the S3 client
const s3 = new S3Client({
  credentials: fromEnv(), // Automatically loads credentials from environment variables
  region: process.env.AWS_REGION,
})

export async function POST(Request) {
  const formData = await Request.formData()
  const files = formData.getAll('files')
  const file = files[1] // Filepond sends 1st element with metadata and 2nd with File
  const slug = Request.headers.get('work-slug')
  const workId = Request.headers.get('work-id')

  const uploadPromises = async () => {
    const randomGeneratedName = generateFileName(file)
    const buffer = await file.arrayBuffer()
    const params = {
      Bucket: 'flm-g-paci',
      Key: `${slug}/${randomGeneratedName}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    }

    try {
      await s3.send(new PutObjectCommand(params))
      await insertWorkImage({ randomGeneratedName, workId })
      return { fileName: randomGeneratedName }
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }

  try {
    const uploadResult = await uploadPromises()
    return new Response(JSON.stringify({ uploadResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function generateFileName(file) {
  const extension = file.name.split('.').pop()
  const randomName = (Math.random() + 1).toString(36).substring(2)
  return `${randomName}.${extension}`
}

const insertWorkImage = async ({ randomGeneratedName, workId }) => {
  const { data, error } = await supabase.from('works_images').insert({
    work_id: workId,
    img: randomGeneratedName,
    order: null, // Aquí deberías determinar el orden adecuado si es necesario
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
