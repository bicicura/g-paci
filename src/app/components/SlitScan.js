// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import * as PIXI from 'pixi.js'
// import { Stage, Sprite, withFilters, Container, useTick } from '@pixi/react'

// class SlitScanFilter extends PIXI.Filter {
//   constructor() {
//     const fragmentShaderCode = [
//       'precision mediump float;',
//       'uniform vec2 dimensions;',
//       'uniform vec2 imgDimensions;',
//       'uniform float mouseX;',
//       'uniform float mouseY;',
//       'uniform sampler2D uSampler;',
//       'uniform float horizontal;',
//       'uniform float scanSize;',
//       'uniform float scanCycles;',
//       'uniform float scanCyclesLarge;',
//       'uniform float wiggle;',
//       'void main()',
//       '{',
//       '\tvec2 uv = gl_FragCoord.xy / dimensions.xy;',
//       '\tuv.y = (1.0 - uv.y);',
//       'const int num_samples = 4;',
//       'const float num_samples_f = float(num_samples);',
//       'vec2 dist = vec2(0.0);',
//       'if ( horizontal < 1.0 ) {',
//       'dist = vec2(0,4.0) / dimensions.xy;',
//       '} else {',
//       'dist = vec2(4.0,0) / dimensions.xy;',
//       '};',
//       'vec2 p0 = uv - 0.5*dist;',
//       'vec2 p1 = uv + 0.5*dist;',
//       'vec2 stepvec = (p1-p0)/(num_samples_f-1.0);',
//       'vec2 sumvec = vec2(0.0);',
//       'vec2 waveone = vec2(0.0);',
//       'vec2 wavetwo = vec2(0.0);',
//       'vec2 tempwave = vec2(0.0);',
//       'const float MIP_BIAS = 100.0;',
//       'vec4 sum_bandy = vec4( 0.0 );',
//       '\tif ( horizontal < 1.0) {',
//       'for(int i=1;i<num_samples;++i)',
//       '{',
//       '\tp0+=stepvec;',
//       'tempwave.y = (uv.y +p0.y)*2.0*(dimensions.y/imgDimensions.y);',
//       'waveone.y = (uv.y +p0.y)*scanCycles*2.0*(dimensions.y/imgDimensions.y);',
//       'wavetwo.y = (uv.y +p0.y)*scanCyclesLarge*2.0*(dimensions.y/imgDimensions.y);',
//       'waveone.y = (sin((waveone.y* (imgDimensions.x / dimensions.x))+mouseY*3.0)*0.5*scanSize+0.5*scanSize)*0.4;',
//       'wavetwo.y = (cos((wavetwo.y*(imgDimensions.x / dimensions.x)+mouseX)+mouseY*-0.6)*0.5*scanSize+0.5*scanSize)*0.6;',
//       'sumvec.x = uv.x*(1.0-wiggle) +wiggle*.5  + (sin(tempwave.y*30.0*wiggle+mouseY*1.0)*.5 + cos(tempwave.y*34.0*wiggle+mouseY*-.3+2.0)*.3 + sin(tempwave.y*53.0*wiggle+mouseY*-0.2+30.0)*.2 + sin(tempwave.y*2.0*wiggle+mouseY*1.0+3.0)*.5 ) *wiggle*.25;',
//       'sumvec.y = waveone.y+wavetwo.y+(1.0-scanSize)*0.5 + (sin(mouseY*-0.1)*0.5)*(1.0-scanSize);',
//       'sum_bandy += texture2D( uSampler, sumvec, MIP_BIAS );',
//       '}',
//       '\t} else {',
//       'for(int i=1;i<num_samples;++i)',
//       '{',
//       '\tp0+=stepvec;',
//       'tempwave.x = (uv.x +p0.x)*2.0*(dimensions.x/imgDimensions.x);',
//       'waveone.x = (uv.x +p0.x)*scanCycles*2.0*(dimensions.x/imgDimensions.x);',
//       'wavetwo.x = (uv.x +p0.x)*scanCyclesLarge*2.0*(dimensions.x/imgDimensions.x);',
//       'waveone.x = (sin((waveone.x* (imgDimensions.y / dimensions.y))+mouseX*3.0)*0.5*scanSize+0.5*scanSize)*0.4;',
//       'wavetwo.x = (cos((wavetwo.x*(imgDimensions.y / dimensions.y)+mouseY)+mouseX*-0.6)*0.5*scanSize+0.5*scanSize)*0.6;',
//       'sumvec.y = uv.y*(1.0-wiggle) +wiggle*.5  + (sin(tempwave.x*30.0*wiggle+mouseX*1.0)*.5 + cos(tempwave.x*34.0*wiggle+mouseX*-.3+2.0)*.3 + sin(tempwave.x*53.0*wiggle+mouseX*-0.2+30.0)*.2 + sin(tempwave.x*2.0*wiggle+mouseX*1.0+3.0)*.5 ) *wiggle*.25;',
//       'sumvec.x = waveone.x+wavetwo.x+(1.0-scanSize)*0.5 + (sin(mouseX*-0.1)*0.5)*(1.0-scanSize);',
//       'sum_bandy += texture2D( uSampler, sumvec, MIP_BIAS );',
//       '}',
//       '\t};',
//       'sum_bandy /= (num_samples_f-1.0);',
//       '   gl_FragColor = sum_bandy;',
//       '}',
//     ].join('\n')
//     super(null, fragmentShaderCode, {
//       dimensions: new Float32Array([512, 512]),
//       imgDimensions: new Float32Array([512, 512]),
//       mouseX: 0,
//       mouseY: 0,
//       horizontal: 1,
//       scanSize: 1,
//       scanCycles: 1,
//       scanCyclesLarge: 1,
//       wiggle: 1,
//     })
//   }
// }

// const Filters = withFilters(Container, {
//   slitScan: SlitScanFilter,
// })

// const SlitComponent = () => {
//   const [uniforms, setUniforms] = useState({
//     dimensions: new Float32Array([512, 512]),
//     imgDimensions: new Float32Array([512, 512]),
//     horizontal: 1,
//     scanSize: 90.2 / 99.99 - 0.01,
//     scanCycles: 1,
//     scanCyclesLarge: 1,
//     wiggle: (20 / 100) * 0.3,
//     mouseX: 0,
//     mouseY: 0,
//   })

//   // Update uniforms based on window size
//   useEffect(() => {
//     const handleResize = () => {
//       setUniforms(u => ({
//         ...u,
//         dimensions: new Float32Array([window.innerWidth, window.innerHeight]),
//       }))
//     }
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Update uniforms based on mouse movement
//   useEffect(() => {
//     const handleMouseMove = e => {
//       setUniforms(u => ({ ...u, mouseX: e.clientX, mouseY: e.clientY }))
//     }
//     window.addEventListener('mousemove', handleMouseMove)
//     return () => window.removeEventListener('mousemove', handleMouseMove)
//   }, [])

//   // Creating a new instance of the filter with updated uniforms
//   const slitScanFilterInstance = new SlitScanFilter()
//   Object.assign(slitScanFilterInstance.uniforms, uniforms)

//   return (
//     <Container
//       width={window.innerWidth}
//       height={window.innerHeight}
//       filters={[slitScanFilterInstance]}
//     >
//       <Sprite
//         width={window.innerWidth}
//         height={window.innerHeight}
//         image="/images/jacbos.jpg"
//       />
//     </Container>
//   )
// }

// const PixiComponent = () => {
//   return (
//     <Stage
//       width={window.innerWidth}
//       height={window.innerHeight}
//       options={{ backgroundColor: 0x000000 }}
//     >
//       <SlitComponent />
//     </Stage>
//   )
// }

// export default PixiComponent
