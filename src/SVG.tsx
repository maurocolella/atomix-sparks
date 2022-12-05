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

const SvgShape: React.FC<Record<string, any>> = ({
  shape,
  color,
  index,
  extrusionSettings
}) => (
    <mesh>
      <meshLambertMaterial
        attach="material"
        color={color}
      />
      <extrudeGeometry
        attach="geometry"
      args={[shape, {
        ...{
          steps: 2,
          depth: 16,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 1
        },
        ...extrusionSettings
      }]}
      />
    </mesh>
  )

const SvgAsync: React.FC<Record<string, any>> = React.memo(({
    url,
    scale,
    position,
    rotation,
    extrusionSettings,
  }) => {
  const { paths } = useLoader(SVGLoader, url) as SVGResult
  const shapes = useMemo(
    () =>
      paths.flatMap((path, index) =>
        path.toShapes(true).map(shape => ({
          index,
          shape,
          color: path.color,
          extrusionSettings,
        }))
      ),
    [paths]
  )
  return (
    <group
      children={shapes.map((props: any, key: number) => (
        <SvgShape key={key} {...props} />
      ))}
      scale={scale ?? [1, 1, 1]}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
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
