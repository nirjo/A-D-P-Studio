import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, useTexture } from "@react-three/drei";
import { Color, type Group, type MeshStandardMaterial } from "three";
import splashUrl from "@/assets/splash.jpg";

export type ProductKey =
  | "tshirt"
  | "gifts"
  | "mug"
  | "cap"
  | "keychain"
  | "bag"
  | "corporate";

function useSplash() {
  const tex = useTexture(splashUrl);
  return tex;
}

const tempColor = new Color();

function Tee({ color }: { color: string }) {
  const map = useSplash();
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.7, 2.1, 0.28]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.75} />
      </mesh>
      <mesh position={[-1.25, 0.6, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[1, 0.6, 0.26]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.75} />
      </mesh>
      <mesh position={[1.25, 0.6, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1, 0.6, 0.26]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.05, 0.15]}>
        <planeGeometry args={[1.25, 1.25]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function Mug({ color }: { color: string }) {
  const map = useSplash();
  const baseMatRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (baseMatRef.current) {
      baseMatRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group rotation={[0, 0.4, 0]}>
      <mesh>
        <cylinderGeometry args={[0.85, 0.8, 1.6, 48, 1, true]} />
        <meshStandardMaterial map={map} roughness={0.25} metalness={0.1} side={2} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.06, 48]} />
        <meshStandardMaterial ref={baseMatRef} color={color} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.42, 0.11, 20, 48, Math.PI * 1.2]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.25} />
      </mesh>
    </group>
  );
}

function Cap({ color }: { color: string }) {
  const map = useSplash();
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group rotation={[0.15, 0.5, 0]}>
      <mesh>
        <sphereGeometry args={[1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.05, 0.85]} rotation={[-0.25, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.08, 40, 1, false, 0, Math.PI]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.45, 0.92]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function GiftBox({ color, ribbon = "#ff2d9b" }: { color: string; ribbon?: string }) {
  const map = useSplash();
  const lidMatRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (lidMatRef.current) {
      lidMatRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group rotation={[0.2, 0.6, 0]}>
      <mesh>
        <boxGeometry args={[1.6, 1.3, 1.6]} />
        <meshStandardMaterial map={map} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.75, 0.22, 1.75]} />
        <meshStandardMaterial ref={lidMatRef} color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.22, 1.35, 1.65]} />
        <meshStandardMaterial color={ribbon} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Keychain({ color }: { color: string }) {
  const map = useSplash();
  return (
    <group rotation={[0.2, 0.3, 0.2]}>
      <mesh position={[0, 0.85, 0]}>
        <torusGeometry args={[0.42, 0.07, 18, 40]} />
        <meshStandardMaterial color={color === "#0b0b0d" ? "#cfcfd4" : color} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.1, 1.4, 0.12]} />
        <meshStandardMaterial map={map} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Bag({ color }: { color: string }) {
  const map = useSplash();
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group rotation={[0.1, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[1.6, 1.9, 0.5]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0.27]}>
        <planeGeometry args={[1.1, 1.2]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
      <mesh position={[-0.45, 1.25, 0]} rotation={[0, 0, 0.12]}>
        <torusGeometry args={[0.42, 0.05, 12, 30, Math.PI]} />
        <meshStandardMaterial ref={matRef} color={color} />
      </mesh>
      <mesh position={[0.45, 1.25, 0]} rotation={[0, 0, -0.12]}>
        <torusGeometry args={[0.42, 0.05, 12, 30, Math.PI]} />
        <meshStandardMaterial ref={matRef} color={color} />
      </mesh>
    </group>
  );
}

function Corporate({ color }: { color: string }) {
  const map = useSplash();
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.color.lerp(tempColor.set(color), Math.min(1, delta * 10));
    }
  });

  return (
    <group rotation={[0.25, 0.5, 0]}>
      <mesh position={[-0.5, -0.2, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.22]} />
        <meshStandardMaterial ref={matRef} color={color} roughness={0.6} />
      </mesh>
      <mesh position={[-0.5, -0.2, 0.13]} rotation={[0, 0.2, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={map} toneMapped={false} transparent />
      </mesh>
      <mesh position={[0.85, -0.35, 0.2]}>
        <cylinderGeometry args={[0.45, 0.42, 1, 36]} />
        <meshStandardMaterial map={map} roughness={0.25} />
      </mesh>
    </group>
  );
}

const MODELS: Record<ProductKey, (props: { color: string }) => React.ReactElement> = {
  tshirt: ({ color }) => <Tee color={color} />,
  gifts: ({ color }) => <GiftBox color={color} ribbon="#38bdf8" />,
  mug: ({ color }) => <Mug color={color} />,
  cap: ({ color }) => <Cap color={color} />,
  keychain: ({ color }) => <Keychain color={color} />,
  bag: ({ color }) => <Bag color={color} />,
  corporate: ({ color }) => <Corporate color={color} />,
};

function Stage({ product, color }: { product: ProductKey; color: string }) {
  const group = useRef<Group>(null);
  const firstFrameReported = useRef(false);
  const Model = useMemo(() => MODELS[product], [product]);

  useFrame((state, delta) => {
    if (!firstFrameReported.current) {
      firstFrameReported.current = true;
      if (typeof window !== "undefined") {
        (window as any).__AIEL_3D_READY = true;
        window.dispatchEvent(new CustomEvent("aiel:3d-ready"));
      }
    }
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    const target = state.pointer.y * 0.25;
    group.current.rotation.x += (target - group.current.rotation.x) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <pointLight position={[-4, 2, -3]} intensity={40} color="#ff2d9b" distance={14} />
      <pointLight position={[4, -2, 3]} intensity={35} color="#38bdf8" distance={14} />
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.5}>
        <group ref={group} key={product}>
          <Model color={color} />
        </group>
      </Float>
      <ContactShadows position={[0, -1.8, 0]} opacity={0.55} blur={3} scale={9} far={4} />
    </>
  );
}

export default function ProductScene({
  product,
  color = "#0b0b0d",
}: {
  product: ProductKey;
  color?: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Stage product={product} color={color} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
