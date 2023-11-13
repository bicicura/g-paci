import supabase from '../../../../../utils/supabaseClient'

export async function POST(Request) {
  const { work, images } = await Request.json()

  const { error: updateWorkError } = await supabase
    .from('works')
    .update({ name: work.name, status: work.status })
    .match({ id: work.id })

  if (updateWorkError) {
    console.error('Error al actualizar el trabajo:', updateWorkError)
    return new Response(JSON.stringify({ error: updateWorkError }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  for (const image of images) {
    const { data, error } = await supabase
      .from('works_images')
      .update({ order: image.order })
      .match({ id: image.id })

    if (error) {
      console.error('Error al actualizar:', error)
    } else {
      console.log('Actualizado con éxito:', data)
    }
  }

  return new Response(JSON.stringify({ message: 'Success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
