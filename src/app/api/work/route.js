import supabase from '../../../../utils/supabaseClient'

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

const insertWork = async ({ name, slug, status }) => {
  return await supabase.from('works').insert([{ name, slug, status }]).select()
}
