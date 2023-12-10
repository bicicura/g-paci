import { useEffect, useRef } from 'react'

function SlitScanEffect() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const img = new Image()
    img.onload = start
    img.src = '/images/img-slitscan.jpg' // Make sure this path is correct in your project

    function start() {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      let mouseX = 0,
        mouseY = 0

      canvas.addEventListener('mousemove', event => {
        mouseX = event.clientX
        mouseY = event.clientY
      })

      function mix(a, b, l) {
        return a + (b - a) * l
      }

      function upDown(v) {
        return Math.sin(v) * 0.5 + 0.5
      }

      function render(time) {
        time *= 0.001

        resize(canvas)

        const t1 = time
        const t2 = time * 0.37

        for (let dstX = 0; dstX < canvas.width; ++dstX) {
          const v = dstX / canvas.width
          const influence = mouseY / canvas.height

          const off1 = Math.sin((v + 0.5) * mix(3, 12, upDown(t1))) * 300 * influence
          const off2 = Math.sin((v + 0.5) * mix(3, 12, upDown(t2))) * 300 * influence
          let off = off1 + off2

          let srcX = (dstX * img.width) / canvas.width + off
          srcX = Math.max(0, Math.min(img.width - 1, srcX))

          ctx.drawImage(img, srcX, 0, 1, img.height, dstX, 0, 1, canvas.height)
        }

        requestAnimationFrame(render)
      }

      requestAnimationFrame(render)

      function resize(canvas) {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        if (width !== canvas.width || height !== canvas.height) {
          canvas.width = width
          canvas.height = height
        }
      }
    }
  }, [])

  return (
    <div className="slit-scan-container">
      <h1 className="slit-scan-text">
        Carlijn Jacobs is a photographer and director based in Paris. Born in the
        Netherlands, she studied photography at Willem de Kooning Academy in Rotterdam
        where she gained early recognition for her witty critiques of mass culture. She is
        associated with a new generation of artists who have matured easy access to
        unlimited reservoirs of historical and contemporaneous imagery. Jacobs has drawn
        inspiration from Surrealism, Art Deco and Camp, which she employs as a sly counter
        to modernism’s conservative definitions of art. Although she methodically plans
        her projects, she creates environments with an eye toward achieving surprising and
        unconventional results. Jacobs’ first monograph, Mannequins, was published in 2021
        by Art Paper Editions. Her editorial projects have appeared in Vogue, Vogue
        France, Vogue Italia, Dazed, Pop, D Repubblica, M le Monde and AnOther Magazine.
        Her commercial clients include Chanel, Gucci, Louis Vuitton, Versace, Loewe and
        Mugler.&nbsp;
        <br />
        <br />
        <br />
        contact: artists@
        <br />
        artandcommerce.com
        <br />
        <br />1 Main Streetbrooklyn NY 11222
        <br />
        tel +1 212 206 0737&nbsp;
      </h1>
      <canvas
        className="slit-scan-canvas slit-scan-backdrop"
        ref={canvasRef}
      ></canvas>
    </div>
  )
}

export default SlitScanEffect
