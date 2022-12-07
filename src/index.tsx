import * as THREE from 'three'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import SVG from './SVG'
import Sparks from './Sparks'
import Particles from './Particles'
import './styles.css'
import { Group } from 'three'

import { createRoot } from 'react-dom/client'


import {
  EffectComposer,
  Bloom,
} from '@react-three/postprocessing'

function Number({ hover } : { hover: any }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.mouse.x * 2, 0.1)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y / 2, 0.2)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.mouse.x / 2, 0.05)
    }
  })
  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <SVG
          url="/atomix.svg"
          scale={[0.6, 0.6, 0.6]}
          position={[60, 12, 10]}
          rotation={[0, Math.PI * 2, Math.PI]}
          extrusionSettings={{
            depth: 4,
          }}
          onClick={() => window.open('https://github.com/react-spring/react-three-fiber/blob/master/whatsnew.md', '_blank')}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)} />
      </group>
    </Suspense>
  )
}

const Filters = () => (
  <EffectComposer>
    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.8} height={300} />
  </EffectComposer>
)

function App() {
  const [hovered, hover] = useState(false)
  const mouse = useRef([0, 0])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)


  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])

  return (
    <Canvas
      linear
      dpr={[1, 2]}
      camera={{ fov: 100, position: [0, 0, -30] }}
      onCreated={({ gl }) => {
        // gl.toneMapping = THREE.Uncharted2ToneMapping
        gl.setClearColor(new THREE.Color('#fff'))
      }}>
      <Filters />
      <pointLight distance={100} intensity={4} color="white" />
      <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
      <Sparks count={20} mouse={mouse} colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']} />
      <Number hover={hover} />
    </Canvas>
  )
}


/**
 *     <Effects />

 */

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />);
