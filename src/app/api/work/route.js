import supabase from '../../../../utils/supabaseClient'
import AWS from 'aws-sdk'

// Configuración del SDK de AWS con credenciales
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export async function GET(request) {
  // Definir los datos simulados
  const mockData = [
    {
      title: 'Overview',
      slug: 'overview',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 1,
    },
    {
      title: 'L’Officiel',
      slug: 'l-officiel',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 2,
    },
    {
      title: 'The Ann Wagners',
      slug: 'the-ann-wagners',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 3,
    },
    {
      title: 'KOSTÜME',
      slug: 'kostume',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 4,
    },
    {
      title: 'Ossira',
      slug: 'ossira',
      imgs: ['slide-1', 'slide-2', 'slide-3'],
      id: 5,
    },
  ]

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
      .single()

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Esto permite que cualquier origen acceda a tu API
      },
    })
  } catch (error) {
    // Devuelve una respuesta con un código de estado 500 y el mensaje de error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Enviar los datos simulados como respuesta en formato JSON
  return new Response(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Esto permite que cualquier origen acceda a tu API
    },
  })
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
  // ... tus variables iniciales ...

  const url = Request.nextUrl

  // Acceder a los searchParams y extraer los parámetros necesarios
  const slug = url.searchParams.get('slug')
  const workId = url.searchParams.get('workId')

  const s3 = new AWS.S3()
  const bucketName = 'flm-g-paci'

  try {
    // Listar todos los objetos en el "directorio"
    const listParams = {
      Bucket: bucketName,
      Prefix: `${slug}/`,
    }
    const listedObjects = await s3.listObjectsV2(listParams).promise()

    // Verificar si hay objetos para eliminar
    if (listedObjects.Contents.length === 0) return

    // Preparar la eliminación de los objetos
    const deleteParams = {
      Bucket: bucketName,
      Delete: { Objects: [] },
    }
    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key })
    })

    // Eliminar los objetos
    await s3.deleteObjects(deleteParams).promise()

    // Manejar referencias en Supabase (ajustar según tu lógica)
    const { data, error } = await supabase.from('works').delete().match({ id: workId })

    if (error) {
      throw error
    }

    // Respuesta de éxito
    return new Response(
      JSON.stringify({
        message: `Work: ${workId + ' ' + slug} Deleted successfully`,
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
    // Si hubo un error, envía una respuesta de error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

const insertWork = async ({ name, slug, status }) => {
  return await supabase.from('works').insert([{ name, slug, status }]).select()
}
