import * as THREE from 'three'
import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { useSprings, a } from 'react-spring/three'

const number = 35
const colors = ['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']
const shapes = ['planeBufferGeometry', 'planeBufferGeometry', 'planeBufferGeometry']

//每次spring之間的設定
const random = (i) => {
  const r = Math.random()
  return {
    position: [100 - Math.random() * 200, 100 - Math.random() * 200, i * 1.5],
    //position: [100 - Math.random() * 100, 100 - Math.random() * 100, i * 1.5],
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    //color: '#AAAAAA',
    //color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
    scale: [1 + r * 15, 1 + r * 15, 1],
    //scale: [1 + r * 5, 1 + r * 5, 1],
    rotation: [0, 0, THREE.Math.degToRad(Math.round(Math.random()) * 45)],
    //rotation: [0, 0, THREE.Math.degToRad(Math.random() * 45)],
  }
}
//console.log('random(1): ', random(1))

//製造number數量的array
const data = new Array(number).fill().map(() => {
  const shape = shapes[Math.round(Math.random() * (shapes.length - 1))]
  return {
    shape,
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    args: [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10],
  }
})
//console.log('data: ', data)

function Content() {
  const [springs, set] = useSprings(number, (i) => ({
    from: random(i),
    ...random(i), //to可省略可寫成 to:[...random(i)]
    config: { mass: 20, tension: 150, friction: 50 },
  }))

  //這行最關鍵
  useEffect(() => void setInterval(() => set((i) => ({ ...random(i), delay: i * 40 })), 3000), [set])
  //改setInterval(,10000)看看

  return data.map((d, index) => (
    <a.mesh key={index} {...springs[index]} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={d.args} />
      <a.meshStandardMaterial attach="material" color={springs[index].color} roughness={0.75} metalness={0.5} />
    </a.mesh>
  ))
}

function Lights() {
  return (
    <group>
      <pointLight intensity={0.3} />
      <ambientLight intensity={2} />
      <spotLight
        castShadow
        intensity={0.2}
        angle={Math.PI / 7}
        position={[150, 150, 250]}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}

function App() {
  return (
    <Canvas shadowMap style={{ background: '#A2CCB6' }} camera={{ position: [0, 0, 150], fov: 100 }}>
      <Lights />
      <mesh receiveShadow>
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} /> {/*調成args={[100, 100]} 看看*/}
        <meshStandardMaterial attach="material" color="#A2ACB6" roughness={1} />
      </mesh>
      <Content />
    </Canvas>
  )
}

export default App
