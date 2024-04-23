import supabase from '../../../../../utils/supabaseClient'

export async function PATCH(request) {
  const { works } = await request.json()

  try {
    for (const work of works) {
      const { error } = await supabase
        .from('works')
        .update({ order: work.order })
        .match({ id: work.id })

      if (error) {
        throw error
      }
    }

    return new Response(JSON.stringify({ message: 'Orden actualizado con éxito' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error al actualizar el orden:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
