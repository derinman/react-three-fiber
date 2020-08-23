import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as meshline from 'threejs-meshline'
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'

extend(meshline)

//單一MeshLine生產工廠
function Fatline({ curve, width, color, speed }) {
  const lineRef = useRef(null)
  useFrame(() => (lineRef.current.uniforms.dashOffset.value -= speed))
  //console.log('lineRef: ', lineRef)
  return (
    <mesh>
      <meshLine attach="geometry" vertices={curve} />
      <meshLineMaterial
        attach="material"
        ref={lineRef}
        depthTest={false} //調成true看看
        lineWidth={width}
        transparent
        color={color}
        dashArray={0.1}
        dashRatio={0.9}
      />
    </mesh>
  )
}

//產生count數量的MeshLine本例是200
function Lines({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        //產生隨機position ([-10,10], [-10,10], [-10,10])
        const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)

        //調成 new Array(3)或 new Array(300)看看 30表示每條mech自身的點數量
        const points = new Array(30)
          .fill()
          .map(() =>
            pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone()
          )
        //console.log(points)

        //每條mech用數值方法取出1000個點代表
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)
        //console.log(curve)

        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, 0.65 * Math.random()),
          speed: Math.max(0.0001, 0.0005 * Math.random()),
          curve,
        }
      }),
    [colors, count]
  )
  //console.log(lines)
  return lines.map((props, index) => <Fatline key={index} {...props} />)
}

function Rig({ mouse }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current[0] / 50 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current[1] / 50 - camera.position.y) * 0.05

    //console.log(mouse.current[0], -mouse.current[1])

    //調成這樣看看
    //camera.position.x += (mouse.current[0] / 5 - camera.position.x) * 0.05
    //camera.position.y += (-mouse.current[1] / 5 - camera.position.y) * 0.05

    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function App() {
  const mouse = useRef([0, 0])
  console.log('mouse: ', mouse)
  console.log('window.innerWidth:', window.innerWidth, 'window.innerHeight: ', window.innerHeight)
  return (
    <Canvas
      style={{ background: '#AAAAAA' }}
      camera={{ position: [0, 0, 10], fov: 25 }}
      onMouseMove={(e) => (mouse.current = [e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2])}>
      <Lines count={200} colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']} />
      {/*Rig是滑鼠互動的關鍵*/}
      <Rig mouse={mouse} />
    </Canvas>
  )
}
