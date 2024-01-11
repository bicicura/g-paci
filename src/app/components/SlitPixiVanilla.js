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
          <div class="flex gap-12 justify-center items-center">
            <a
              target="_blank"
              href="https://www.instagram.com/gastonpaci/"
            >
              <svg
                className="w-20 h-20 text-white fill-white mx-auto"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
            <a href="mailto:gastonpaci@gmail.com">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-24 h-24 text-white mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>
          <br /> Buenos Aires, Argentina <br /> gastonpaci.com
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
