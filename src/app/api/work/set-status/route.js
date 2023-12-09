import supabase from '../../../../../utils/supabaseClient'

export async function POST(Request) {
  // Obtener el ID del trabajo y el nuevo estado del cuerpo de la solicitud
  const { workId, newStatus } = await Request.json()

  try {
    // Actualizar el estado del trabajo en Supabase
    const { error } = await supabase
      .from('works')
      .update({ status: newStatus })
      .match({ id: workId })

    if (error) {
      console.error('Error al actualizar el estado del trabajo:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Respuesta de éxito
    return new Response(JSON.stringify({ message: 'Estado actualizado con éxito' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Manejar cualquier otro error
    console.error('Error al procesar la solicitud:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
