import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { ShaderMaterial, Vector2, TextureLoader } from 'three'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

extend({ ShaderMaterial })

const ImageEffect = ({ texture, mouse }) => {
  const mesh = useRef()
  const { viewport, camera } = useThree()
  const aberrationIntensity = useRef(0.0)
  const fov = 80 // camera vertical field of view in degrees

  const planeWidth = viewport.width
  const planeHeight = planeWidth / (1920 / 1200)
  const scale = [1, 1, 1]

  useEffect(() => {
    // Update camera aspect ratio
    camera.aspect = viewport.width / viewport.height
    camera.updateProjectionMatrix()
  }, [camera, viewport.width, viewport.height])

  useFrame(() => {
    const easeFactor = 0.02

    // Smoothly transition the mouse position
    aberrationIntensity.current = Math.max(0.0, aberrationIntensity.current - 0.05)
    if (mesh.current) {
      const deltaX =
        (mouse.current.x - mesh.current.material.uniforms.u_mouse.value.x) * easeFactor
      const deltaY =
        (mouse.current.y - mesh.current.material.uniforms.u_mouse.value.y) * easeFactor

      mesh.current.material.uniforms.u_mouse.value.x += deltaX
      mesh.current.material.uniforms.u_mouse.value.y += deltaY
      mesh.current.material.uniforms.u_aberrationIntensity.value =
        aberrationIntensity.current
    }
  })

  return (
    <mesh
      ref={mesh}
      scale={scale}
    >
      <planeGeometry
        attach="geometry"
        args={[planeWidth, planeHeight]}
      />
      <shaderMaterial
        attach="material"
        uniforms={{
          u_texture: { value: texture },
          u_mouse: { value: mouse.current },
          u_aberrationIntensity: { value: aberrationIntensity.current },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

const InteractiveImage = ({ imageUrl }) => {
  const [texture, setTexture] = useState()
  const mouse = useRef(new Vector2(0.5, 0.5))
  const [aspectRatio, setAspectRatio] = useState(1)

  useEffect(() => {
    new TextureLoader().load(imageUrl, tex => {
      setAspectRatio(tex.image.width / tex.image.height)
      setTexture(tex)
    })
  }, [imageUrl])

  const handleMouseMove = event => {
    const rect = event.currentTarget.getBoundingClientRect()

    // Calculate mouse position relative to the canvas
    mouse.current.x = (event.clientX - rect.left) / rect.width

    // Invert the Y-coordinate to match Three.js coordinate system
    mouse.current.y = 1 - (event.clientY - rect.top) / rect.height
  }

  return (
    <div
      className="fixed inset-0 m-auto"
      id="canvas-container"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{
          fov: 80,
          near: 0.01,
          far: 10,
          position: [0, 0, 1],
        }}
      >
        {texture && (
          <ImageEffect
            texture={texture}
            mouse={mouse}
            aspectRatio={1900 / 1200}
          />
        )}
      </Canvas>
    </div>
  )
}

export default InteractiveImage
