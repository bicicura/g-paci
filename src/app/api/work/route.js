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
    headers: { 'Content-Type': 'application/json' },
  })
}
