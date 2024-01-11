import { useContext, useEffect } from 'react'
import * as PIXI from 'pixi.js'
import { EffectsContext } from '../contexts/EffectsContext'

const SlitPixiVanilla = () => {
  const { isLoading, infoEffectConfig } = useContext(EffectsContext)

  useEffect(() => {
    // console.log(infoEffectConfig)
  }, [isLoading, infoEffectConfig])

  useEffect(() => {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
    })

    // Reference to the container where the Pixi.js app will mount
    const container = document.getElementById('slit-scan-container')
    container.appendChild(app.view)

    // Load and display an image
    let texture = PIXI.Texture.from(infoEffectConfig.img)
    let image = new PIXI.Sprite(texture)
    image.width = app.renderer.width
    image.height = app.renderer.height
    app.stage.addChild(image)

    // Custom Slit-Scan Shader
    let slitScanFilter = new SlitScanFilter()
    image.filters = [slitScanFilter]

    // Default values that can be updated dynamically
    let uniforms = {
      dimensions: [window.innerWidth, window.innerHeight],
      imgDimensions: new Float32Array([512, 512]),
      horizontal: 1,
      scanSize: 90.2 / 99.99 - 0.01,
      scanCycles: 1,
      scanCyclesLarge: 1,
      wiggle: (20 / 100) * 0.3,
      mouseX: 0,
      mouseY: 0,
    }

    slitScanFilter.uniforms.dimensions = uniforms.dimensions
    slitScanFilter.uniforms.imgDimensions = uniforms.imgDimensions
    slitScanFilter.uniforms.horizontal = uniforms.horizontal
    slitScanFilter.uniforms.scanSize = uniforms.scanSize
    slitScanFilter.uniforms.scanCycles = uniforms.scanCycles
    slitScanFilter.uniforms.scanCyclesLarge = uniforms.scanCyclesLarge
    slitScanFilter.uniforms.wiggle = uniforms.wiggle
    slitScanFilter.uniforms.mouseX = uniforms.mouseX
    slitScanFilter.uniforms.mouseY = uniforms.mouseY

    let scrollPosition = { x: 0, y: 0 }

    function updateShaderScrollInteraction() {
      window.addEventListener('scroll', function () {
        // Calculate the change in scroll position
        let deltaX = window.scrollX - scrollPosition.x
        let deltaY = window.scrollY - scrollPosition.y

        // Update the uniforms based on scroll movement
        uniforms.mouseX += deltaX * 0.005 // Adjust the multiplier as needed
        uniforms.mouseY += deltaY * 0.005 // Adjust the multiplier as needed

        // Update the scroll position
        scrollPosition.x = window.scrollX
        scrollPosition.y = window.scrollY
      })
    }

    updateShaderScrollInteraction()

    let lastMousePosition = { x: 0, y: 0 }

    function updateShaderInteraction() {
      document.addEventListener('mousemove', function (event) {
        // Calculate current mouse position
        let currentMouseX = event.clientX / window.innerWidth
        let currentMouseY = event.clientY / window.innerHeight

        // Calculate incremental change based on mouse movement
        let deltaX = currentMouseX - lastMousePosition.x
        let deltaY = currentMouseY - lastMousePosition.y

        // Apply incremental change
        uniforms.mouseX += deltaX
        uniforms.mouseY += deltaY

        // Update last mouse position
        lastMousePosition.x = currentMouseX
        lastMousePosition.y = currentMouseY
      })
      document.addEventListener('mouseenter', function (event) {
        // Update last mouse position when the mouse enters the viewport
        lastMousePosition.x = event.clientX / window.innerWidth
        lastMousePosition.y = event.clientY / window.innerHeight
      })
    }

    updateShaderInteraction()

    let defaultDelta = 0.005

    // Render loop
    app.ticker.add(() => {
      // Update the increments to create a continuous movement effect
      uniforms.mouseX += defaultDelta
      uniforms.mouseY += defaultDelta

      // Apply the increments to the shader uniforms
      slitScanFilter.uniforms.mouseX = uniforms.mouseX
      slitScanFilter.uniforms.mouseY = uniforms.mouseY

      // Render the stage
      app.renderer.render(app.stage)
    })

    // Cleanup logic when the component unmounts
    return () => {
      app.destroy(true, true) // This will clear the WebGL context
      if (container && container.contains(app.view)) {
        container.removeChild(app.view) // Safely remove the canvas from the DOM
      }
    }
  }, [])

  return (
    <>
      <div
        className="text-container"
        style={{ mixBlendMode: 'difference', color: '#FFF' }}
      >
        <h1>
          {!isLoading && infoEffectConfig.body}
          <br />
          <br />
          xxxxxxxx: xxxxxxx@
          <br /> xxxxxxxxxtxxxxxxx.xxm <br />
          <br /> 1 Xxxx Xxxxxxxxxyyxx XY 11222 <br /> xxx +1 212 206 0737
        </h1>
      </div>
      <div id="slit-scan-container"></div>
    </>
  )
}

export default SlitPixiVanilla

class SlitScanFilter extends PIXI.Filter {
  constructor() {
    const fragmentShaderCode = [
      'precision mediump float;',
      'uniform vec2 dimensions;',
      'uniform vec2 imgDimensions;',
      'uniform float mouseX;',
      'uniform float mouseY;',
      'uniform sampler2D uSampler;',
      'uniform float horizontal;',
      'uniform float scanSize;',
      'uniform float scanCycles;',
      'uniform float scanCyclesLarge;',
      'uniform float wiggle;',
      'void main()',
      '{',
      '\tvec2 uv = gl_FragCoord.xy / dimensions.xy;',
      '\tuv.y = (1.0 - uv.y);',
      'const int num_samples = 4;',
      'const float num_samples_f = float(num_samples);',
      'vec2 dist = vec2(0.0);',
      'if ( horizontal < 1.0 ) {',
      'dist = vec2(0,4.0) / dimensions.xy;',
      '} else {',
      'dist = vec2(4.0,0) / dimensions.xy;',
      '};',
      'vec2 p0 = uv - 0.5*dist;',
      'vec2 p1 = uv + 0.5*dist;',
      'vec2 stepvec = (p1-p0)/(num_samples_f-1.0);',
      'vec2 sumvec = vec2(0.0);',
      'vec2 waveone = vec2(0.0);',
      'vec2 wavetwo = vec2(0.0);',
      'vec2 tempwave = vec2(0.0);',
      'const float MIP_BIAS = 100.0;',
      'vec4 sum_bandy = vec4( 0.0 );',
      '\tif ( horizontal < 1.0) {',
      'for(int i=1;i<num_samples;++i)',
      '{',
      '\tp0+=stepvec;',
      'tempwave.y = (uv.y +p0.y)*2.0*(dimensions.y/imgDimensions.y);',
      'waveone.y = (uv.y +p0.y)*scanCycles*2.0*(dimensions.y/imgDimensions.y);',
      'wavetwo.y = (uv.y +p0.y)*scanCyclesLarge*2.0*(dimensions.y/imgDimensions.y);',
      'waveone.y = (sin((waveone.y* (imgDimensions.x / dimensions.x))+mouseY*3.0)*0.5*scanSize+0.5*scanSize)*0.4;',
      'wavetwo.y = (cos((wavetwo.y*(imgDimensions.x / dimensions.x)+mouseX)+mouseY*-0.6)*0.5*scanSize+0.5*scanSize)*0.6;',
      'sumvec.x = uv.x*(1.0-wiggle) +wiggle*.5  + (sin(tempwave.y*30.0*wiggle+mouseY*1.0)*.5 + cos(tempwave.y*34.0*wiggle+mouseY*-.3+2.0)*.3 + sin(tempwave.y*53.0*wiggle+mouseY*-0.2+30.0)*.2 + sin(tempwave.y*2.0*wiggle+mouseY*1.0+3.0)*.5 ) *wiggle*.25;',
      'sumvec.y = waveone.y+wavetwo.y+(1.0-scanSize)*0.5 + (sin(mouseY*-0.1)*0.5)*(1.0-scanSize);',
      'sum_bandy += texture2D( uSampler, sumvec, MIP_BIAS );',
      '}',
      '\t} else {',
      'for(int i=1;i<num_samples;++i)',
      '{',
      '\tp0+=stepvec;',
      'tempwave.x = (uv.x +p0.x)*2.0*(dimensions.x/imgDimensions.x);',
      'waveone.x = (uv.x +p0.x)*scanCycles*2.0*(dimensions.x/imgDimensions.x);',
      'wavetwo.x = (uv.x +p0.x)*scanCyclesLarge*2.0*(dimensions.x/imgDimensions.x);',
      'waveone.x = (sin((waveone.x* (imgDimensions.y / dimensions.y))+mouseX*3.0)*0.5*scanSize+0.5*scanSize)*0.4;',
      'wavetwo.x = (cos((wavetwo.x*(imgDimensions.y / dimensions.y)+mouseY)+mouseX*-0.6)*0.5*scanSize+0.5*scanSize)*0.6;',
      'sumvec.y = uv.y*(1.0-wiggle) +wiggle*.5  + (sin(tempwave.x*30.0*wiggle+mouseX*1.0)*.5 + cos(tempwave.x*34.0*wiggle+mouseX*-.3+2.0)*.3 + sin(tempwave.x*53.0*wiggle+mouseX*-0.2+30.0)*.2 + sin(tempwave.x*2.0*wiggle+mouseX*1.0+3.0)*.5 ) *wiggle*.25;',
      'sumvec.x = waveone.x+wavetwo.x+(1.0-scanSize)*0.5 + (sin(mouseX*-0.1)*0.5)*(1.0-scanSize);',
      'sum_bandy += texture2D( uSampler, sumvec, MIP_BIAS );',
      '}',
      '\t};',
      'sum_bandy /= (num_samples_f-1.0);',
      '   gl_FragColor = sum_bandy;',
      '}',
    ].join('\n')
    super(null, fragmentShaderCode, {
      dimensions: new Float32Array([512, 512]),
      imgDimensions: new Float32Array([512, 512]),
      mouseX: 0,
      mouseY: 0,
      horizontal: 1,
      scanSize: 1,
      scanCycles: 1,
      scanCyclesLarge: 1,
      wiggle: 1,
    })
  }
}
