import { BlurFilter } from 'pixi.js'
import { useMemo, useRef, useEffect } from 'react'
import { Stage, Sprite } from '@pixi/react'
import { Filter, Program } from 'pixi.js'

const vertexShader = `
attribute vec2 aVertexPosition;
void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}`

const fragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main(void){
    vec2 coordinate = vTextureCoord;

    // Modify this part to create the slit-scan effect
    coordinate.x += sin(coordinate.y * 10.0 + time) * 0.05;

    gl_FragColor = texture2D(uSampler, coordinate);
}
`

const DefaultSlit = () => {
  const filterRef = useRef()

  useEffect(() => {
    // Creating a filter with null as the first parameter to use the default vertex shader
    const filter = new Filter(null, fragmentShader, { time: 0 })

    filterRef.current = filter

    // Animation loop to update the time uniform
    const animate = deltaTime => {
      if (filterRef.current) {
        filterRef.current.uniforms.time += deltaTime * 0.01
      }
      requestAnimationFrame(animate)
    }

    animate(0)
  }, [])

  const blurFilter = useMemo(() => new BlurFilter(4), [])

  return (
    <Stage>
      <Sprite
        image="images/jacbos.jpg"
        x={400}
        y={270}
        anchor={{ x: 0.5, y: 0.5 }}
        filters={[blurFilter, filterRef.current]}
      />
    </Stage>
  )
}

export default DefaultSlit
