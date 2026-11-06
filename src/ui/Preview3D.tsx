import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useState, useEffect } from "react";
import type { Config } from "../domain/builder";
import { cases, keycaps, layouts } from "../domain/builder";
import { keyboardGeometry } from "../domain/geometry";
function CameraView({ zoom, reset }: { zoom: number; reset: number }) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    // Three.js exposes a mutable camera; update it without recreating the WebGL canvas.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    invalidate();
  }, [zoom, camera, invalidate]);
  useEffect(() => {
    camera.position.set(0, 6, 8);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [reset, camera, invalidate]);
  return null;
}
export default function Preview3D({
  config,
  exploded,
  onFailure,
}: {
  config: Config;
  exploded: boolean;
  onFailure: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [reset, setReset] = useState(0);
  const color = cases.find((c) => c.id === config.case)!.color,
    caps = keycaps.find((c) => c.id === config.keycap)!.color;
  const count = layouts[config.layout].keys;
  const geometry = keyboardGeometry(config.layout);
  const boardWidth = geometry.width * 0.42 + 0.3;
  const boardDepth = geometry.rows * 0.42 + 0.3;
  return (
    <>
      <div className="webgl-stage">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 6, 8], fov: 42, zoom }}
          onCreated={({ gl }) =>
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                onFailure();
              },
              { once: true },
            )
          }
        >
          <CameraView zoom={zoom} reset={reset} />
          <ambientLight intensity={1.8} />
          <directionalLight position={[3, 8, 5]} intensity={3} />
          <group rotation={[0, rotation, 0]}>
            <RoundedBox args={[boardWidth, 0.36, boardDepth]} radius={0.1}>
              <meshStandardMaterial
                color={color}
                roughness={0.4}
                metalness={0.45}
              />
            </RoundedBox>
            {exploded && (
              <RoundedBox
                args={[boardWidth - 0.2, 0.05, boardDepth - 0.2]}
                position={[0, 0.65, 0]}
                radius={0.03}
              >
                <meshStandardMaterial color="#686d61" />
              </RoundedBox>
            )}
            {geometry.keys.map((key, i) => {
              return (
                <group
                  key={i}
                  position={[
                    (key.x + key.width / 2 - geometry.width / 2) * 0.42,
                    exploded ? 1.35 : 0.31,
                    (key.y - (geometry.rows - 1) / 2) * 0.42,
                  ]}
                >
                  {exploded && (
                    <mesh position={[0, -0.4, 0]}>
                      <boxGeometry args={[0.17, 0.22, 0.17]} />
                      <meshStandardMaterial color="#b8c9b2" />
                    </mesh>
                  )}
                  <RoundedBox
                    args={[key.width * 0.42 - 0.035, 0.19, 0.375]}
                    radius={0.035}
                  >
                    <meshStandardMaterial
                      color={i === 0 ? "#315bee" : caps}
                      roughness={0.55}
                    />
                  </RoundedBox>
                </group>
              );
            })}
          </group>
          <OrbitControls
            enablePan={false}
            minPolarAngle={0.3}
            maxPolarAngle={1.25}
            minAzimuthAngle={-0.7}
            maxAzimuthAngle={0.7}
            enableZoom={false}
          />
        </Canvas>
      </div>
      <div className="preview-buttons">
        <button onClick={() => setRotation(Math.max(-0.6, rotation - 0.2))}>
          Rotate left
        </button>
        <button onClick={() => setRotation(Math.min(0.6, rotation + 0.2))}>
          Rotate right
        </button>
        <button onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}>
          Zoom in
        </button>
        <button onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}>
          Zoom out
        </button>
        <button
          onClick={() => {
            setRotation(0);
            setZoom(1);
            setReset((x) => x + 1);
          }}
        >
          Reset view
        </button>
      </div>
      <p className="small muted">
        Interactive material study · key positions are schematic. Exact key
        count: {count}.
      </p>
    </>
  );
}
