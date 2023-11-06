import AWS from 'aws-sdk'

export async function GET(Request) {
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

  // Enviar los datos simulados como respuesta en formato JSON
  return new Response(JSON.stringify(mockData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Esto permite que cualquier origen acceda a tu API
    },
  })
}

// export async function POST(Request) {
//   const s3 = new AWS.S3()
//   // console.log(Request.body)
//   ;(async () => {
//     s3.putObject({
//       Key: 'my-file.txt',
//       Bucket: 'flm-g-paci',
//       Body: 'Hello World!',
//     }).promise()
//   })()

//   return new Response(JSON.stringify({ status: 'ok' }), {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

export async function POST(request) {
  const s3 = new AWS.S3()
  const formData = await request.formData()
  const files = formData.getAll('file') // Obtiene todos los archivos de FormData
  const slug = formData.get('slug')

  if (!files.length) {
    return new Response(JSON.stringify({ error: 'No files found.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const uploadPromises = files.map(async file => {
    // Lee el archivo como buffer
    const buffer = await file.arrayBuffer()

    // Configura los parámetros de carga
    const params = {
      Bucket: 'flm-g-paci',
      Key: `${slug}/${Date.now()}_${file.name}`, // Asegúrate de que el nombre del archivo sea único
      Body: Buffer.from(buffer), // Convierte el arrayBuffer a Buffer
      ContentType: file.type,
    }

    try {
      // Realiza la carga a S3
      const s3Response = await s3.upload(params).promise()
      return { status: 'ok', url: s3Response.Location } // Retorna el estado y la URL
    } catch (error) {
      throw new Error(error.message) // Lanza un error que será capturado más abajo
    }
  })

  try {
    // Espera a que todas las promesas de carga se resuelvan
    const uploadResults = await Promise.all(uploadPromises)
    // Retorna las URLs de los archivos subidos
    return new Response(JSON.stringify(uploadResults), {
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
