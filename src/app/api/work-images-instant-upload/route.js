import AWS from 'aws-sdk'
import supabase from '../../../../utils/supabaseClient'

export async function POST(Request) {
  const s3 = new AWS.S3()
  const formData = await Request.formData()
  const files = formData.getAll('files')
  // filepond sends 1st element with metadata and 2nd with File
  const file = files[1]
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
      const s3Response = await s3.upload(params).promise()
      await insertWorkImage({ randomGeneratedName, workId })
      return s3Response
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  try {
    // Ejecutar la función uploadPromises y esperar su resolución
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
