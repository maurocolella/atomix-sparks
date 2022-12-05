import React, { Suspense, useMemo } from 'react'
import { Box } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { SVGLoader, SVGResult } from 'three-stdlib'
import { DoubleSide } from 'three'

const DefaultModel = () => (
  <Box args={[1, 1, 1]}>
    <meshBasicMaterial attach="material" color="hotpink" />
  </Box>
)

const SvgShape: React.FC<Record<string, any>> = ({ shape, color, index }) => {
  const extrusionSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
  }

  return (
    <mesh>
      <meshLambertMaterial
        attach="material"
        color={color}
        transparent={true}
        side={DoubleSide}
        depthWrite={false}
      />
      <extrudeGeometry
        attach="geometry"
        args={[shape, extrusionSettings]}
      />
    </mesh>
  )
}

const SvgAsync: React.FC<Record<string, any>> = React.memo(({ url }) => {
  const { paths } = useLoader(SVGLoader, url) as SVGResult
  const shapes = useMemo(
    () =>
      paths.flatMap((path, index) =>
        path.toShapes(true).map(shape => ({ index, shape, color: path.color }))
      ),
    [paths]
  )
  return (
    <group
      children={shapes.map((props: any, key: number) => (
        <SvgShape key={key} {...props} />
      ))}
      scale={[0.01, 0.01, 0.01]}
      position={[-1, 0.5, 0]}
      rotation={[0, Math.PI * 1.05, Math.PI]}
    />
  )
})

const SVG = (props: any) => (
  <Suspense
    fallback={<DefaultModel {...props} />}
    children={<SvgAsync {...props} />}
  />
)

export default SVG