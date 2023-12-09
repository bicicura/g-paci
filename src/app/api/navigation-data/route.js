import supabase from '../../../../utils/supabaseClient'
import { WORK_STATUS_ACTIVE } from '../../../../constants'

export async function GET(request) {
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
      .eq('status', WORK_STATUS_ACTIVE)
      .order('id', { foreignTable: 'works_images' }) // Assuming 'id' is your primary key in 'works_images'
      .limit(1, { foreignTable: 'works_images' })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Esto permite que cualquier origen acceda a tu API
        'Cache-Control': 'no-store', // Evita el almacenamiento en caché
        Pragma: 'no-cache', // HTTP 1.0 backward compatibility
        Expires: '0', // Proxies
      },
    })
  } catch (error) {
    // Devuelve una respuesta con un código de estado 500 y el mensaje de error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
