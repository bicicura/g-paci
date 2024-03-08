import supabase from '../../../../utils/supabaseClient'
import { S3Client, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import { WORK_STATUS_ACTIVE, BUCKET_NAME } from '../../../../constants'

// Initialize the S3 client
const s3 = new S3Client({
  credentials: fromEnv(), // Automatically loads credentials from environment variables
  region: process.env.AWS_REGION,
})

export async function GET(request) {
  const url = request.nextUrl

  // Acceder a los searchParams y extraer los parámetros necesarios
  const slug = url.searchParams.get('slug')

  try {
    const { data, error } = await supabase
      .from('works')
      .select(
        `
        *,
        works_images (
          img,
          order
        )
      `
      )
      .eq('slug', slug)
      .eq('status', WORK_STATUS_ACTIVE)
      .single()

    if (error) {
      throw error
    } else if (data) {
      // Ordenar works_images por 'order' de manera descendente
      data.works_images.sort((a, b) => a.order - b.order)
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Esto permite que cualquier origen acceda a tu API
      },
    })
  } catch (error) {
    // More than 1 or no items where returned when requesting a singular response
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'No data found' }), {
        status: 404,
      })
    }
    // Devuelve una respuesta con un código de estado 500 y el mensaje de error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(Request) {
  const { name, slug, status } = await Request.json()

  try {
    const { data: workData, error: workError } = await insertWork({ name, slug, status })

    if (workError) {
      // Devuelve una respuesta con un código de estado 400 y el mensaje de error
      return new Response(JSON.stringify({ error: workError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Si todo salió bien, devuelve una respuesta con código de estado 200 y los datos insertados
    return new Response(JSON.stringify(workData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(Request, context) {
  const url = Request.nextUrl
  const slug = url.searchParams.get('slug')
  const workId = url.searchParams.get('workId')

  try {
    // List all objects in the "directory"
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `${slug}/`,
    }
    const listedObjects = await s3.send(new ListObjectsV2Command(listParams))

    if (listedObjects?.Contents?.length > 0) {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key })),
        },
      }

      // Delete the objects
      await s3.send(new DeleteObjectsCommand(deleteParams))
    }

    // Handle references in Supabase (adjust according to your logic)
    const { data, error } = await supabase.from('works').delete().match({ id: workId })

    if (error) {
      throw error
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: `Work: ${workId} - ${slug} Deleted successfully`,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Deletion error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

const insertWork = async ({ name, slug, status }) => {
  return await supabase.from('works').insert([{ name, slug, status }]).select()
}
