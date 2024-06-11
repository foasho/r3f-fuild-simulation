import { useRef } from "react";
import vertexShader from "../glsl/fluid.vert";
import fragmentShader from "../glsl/fluid.frag";
import { ShaderMaterial, Vector2 } from "three";
import { useFrame } from "@react-three/fiber";
import { calcForce } from "../utils/force";

const current_pointer = new Vector2();
const diff = new Vector2();
export const FluidShader = () => {

  const ref = useRef<ShaderMaterial>(null);

  const shaderMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uProgress: { value: 0.5 },
      pointer: { value: new Vector2() },
      force: { value: new Vector2() },
      aspectRatio: { value: 1 },
      velocity: { value: new Vector2() }
    }
  });

  useFrame(({ clock, pointer }) => {
    if (current_pointer.x === 0 || current_pointer.y === 0) {
      current_pointer.copy(pointer);
      return;
    }
    // pointerの差分をとってvelocityにする
    const _diff = pointer.clone().sub(current_pointer);
    shaderMaterial.uniforms.uProgress.value = Math.sin(clock.elapsedTime);
    shaderMaterial.uniforms.pointer.value = pointer;
    const force = calcForce(_diff);
    shaderMaterial.uniforms.force.value = force;
    current_pointer.copy(pointer);
  });

  return (
    <mesh scale={3}>
      <planeGeometry args={[1, 1, 1]}/>
      <primitive object={shaderMaterial} ref={ref} attach="material"/>
    </mesh>
  )
}