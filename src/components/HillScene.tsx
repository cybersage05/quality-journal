import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "../hooks/useTheme";

/* Palette per theme — Three.js can't read CSS variables, so mirror them here. */
const palettes = {
  light: {
    fog: "#d9e9f0",
    far: "#aecdd6",
    mid: "#a0c4ae",
    near: "#5e9272",
    firefly: "#e8c987",
    petalA: "#cfe0b4",
    petalB: "#e8d9a8",
    cloud: "#ffffff",
  },
  dark: {
    fog: "#16242c",
    far: "#223842",
    mid: "#2c4439",
    near: "#274434",
    firefly: "#ffd98a",
    petalA: "#5a7250",
    petalB: "#8a7a4e",
    cloud: "#b9c9d4",
  },
} as const;

/** Build a soft rolling-hill silhouette as a flat ShapeGeometry. */
function hillGeometry(seed: number, amplitude: number, baseY: number) {
  const shape = new THREE.Shape();
  const width = 60;
  shape.moveTo(-width / 2, -12);
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const x = -width / 2 + (i / steps) * width;
    const y =
      baseY +
      Math.sin(x * 0.14 + seed) * amplitude +
      Math.sin(x * 0.05 + seed * 2.3) * amplitude * 1.6 +
      Math.sin(x * 0.31 + seed * 4.1) * amplitude * 0.3;
    shape.lineTo(x, y);
  }
  shape.lineTo(width / 2, -12);
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 48);
}

function Hills({ theme, animate }: { theme: Theme; animate: boolean }) {
  const p = palettes[theme];
  const layers = useMemo(
    () => [
      { geo: hillGeometry(1.7, 0.55, 1.6), z: -16, factor: 0.15 },
      { geo: hillGeometry(4.2, 0.75, 0.2), z: -10, factor: 0.3 },
      { geo: hillGeometry(8.9, 0.95, -1.4), z: -5, factor: 0.45 },
    ],
    []
  );
  const colors = [p.far, p.mid, p.near];
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    if (!animate) return;
    const scroll = window.scrollY;
    layers.forEach((l, i) => {
      const m = refs.current[i];
      if (m) m.position.y = -3.2 + scroll * 0.004 * l.factor;
    });
  });

  return (
    <>
      {layers.map((l, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={l.geo}
          position={[0, -3.2, l.z]}
        >
          <meshBasicMaterial color={colors[i]} fog />
        </mesh>
      ))}
    </>
  );
}

/** Soft cloud sprites drifting through the 3D sky. */
function Clouds({ theme, animate }: { theme: Theme; animate: boolean }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const puff = (x: number, y: number, r: number, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 128);
    };
    puff(80, 70, 55, 0.9);
    puff(130, 55, 60, 0.85);
    puff(180, 72, 50, 0.8);
    puff(128, 80, 90, 0.5);
    return new THREE.CanvasTexture(c);
  }, []);

  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(
    () => [
      { x: -10, y: 4.2, z: -14, s: 7, v: 0.12 },
      { x: 4, y: 5.4, z: -18, s: 9, v: 0.08 },
      { x: 12, y: 3.4, z: -12, s: 5, v: 0.16 },
      { x: -3, y: 6.2, z: -20, s: 11, v: 0.05 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    group.current.children.forEach((m, i) => {
      m.position.x += clouds[i].v * delta;
      if (m.position.x > 22) m.position.x = -22;
    });
  });

  const tint = palettes[theme].cloud;
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]}>
          <planeGeometry args={[c.s, c.s * 0.5]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={theme === "dark" ? 0.16 : 0.55}
            color={tint}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const fireflyVertex = /* glsl */ `
  attribute float phase;
  attribute float speed;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * speed, 9.0) - 4.0;
    p.x += sin(uTime * 0.5 + phase * 6.28) * 0.6;
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.4 + phase * 12.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (140.0 / -mv.z) * (0.5 + phase * 0.5);
    gl_Position = projectionMatrix * mv;
  }
`;

const fireflyFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, glow * vAlpha);
  }
`;

function Fireflies({ theme, count, animate }: { theme: Theme; count: number; animate: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 9 - 4;
      positions[i * 3 + 2] = -3 - Math.random() * 10;
      phases[i] = Math.random();
      speeds[i] = 0.15 + Math.random() * 0.25;
    }
    return { positions, phases, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(palettes[theme].firefly) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (!animate || !mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uColor.value.set(palettes[theme].firefly);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={fireflyVertex}
        fragmentShader={fireflyFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Wind-carried petals/seeds — diagonal drift with sinusoidal tumble. */
const petalVertex = /* glsl */ `
  attribute float phase;
  attribute float speed;
  attribute float hue;
  uniform float uTime;
  varying float vAlpha;
  varying float vHue;
  void main() {
    vec3 p = position;
    float t = uTime * speed;
    p.x = mod(p.x + t * 1.6 + 11.0, 22.0) - 11.0;
    p.y = mod(p.y - t * 0.55 + sin(uTime * 0.8 + phase * 6.28) * 0.4 + 5.0, 10.0) - 5.0;
    vAlpha = 0.5 + 0.5 * sin(uTime * 2.2 + phase * 9.0);
    vHue = hue;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (90.0 / -mv.z) * (0.6 + phase * 0.4);
    gl_Position = projectionMatrix * mv;
  }
`;

const petalFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vHue;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(vec2(q.x * 1.6, q.y));
    float shape = smoothstep(0.5, 0.18, d);
    vec3 col = mix(uColorA, uColorB, vHue);
    gl_FragColor = vec4(col, shape * (0.35 + 0.45 * vAlpha));
  }
`;

function Petals({ theme, count, animate }: { theme: Theme; count: number; animate: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, speeds, hues } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const hues = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 10 - 5;
      positions[i * 3 + 2] = -2 - Math.random() * 8;
      phases[i] = Math.random();
      speeds[i] = 0.3 + Math.random() * 0.5;
      hues[i] = Math.random();
    }
    return { positions, phases, speeds, hues };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(palettes[theme].petalA) },
      uColorB: { value: new THREE.Color(palettes[theme].petalB) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (!animate || !mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uColorA.value.set(palettes[theme].petalA);
    mat.current.uniforms.uColorB.value.set(palettes[theme].petalB);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-hue" args={[hues, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={petalVertex}
        fragmentShader={petalFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

/** Eases the camera toward the pointer for gentle 3D parallax. */
function MouseRig({ animate }: { animate: boolean }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    if (!animate) return;
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -8);
  });
  return null;
}

/**
 * Ambient depth behind the hero — watercolor hills in fog, drifting cloud
 * sprites, gold fireflies and wind-blown petals. Eases toward the pointer.
 */
export default function HillScene({
  theme,
  reduced,
}: {
  theme: Theme;
  reduced: boolean;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const animate = !reduced;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      {!isMobile && <fog attach="fog" args={[palettes[theme].fog, 6, 26]} />}
      <Hills theme={theme} animate={animate} />
      <Clouds theme={theme} animate={animate} />
      <Fireflies theme={theme} count={isMobile ? 8 : 16} animate={animate} />
      <Petals theme={theme} count={isMobile ? 10 : 22} animate={animate} />
      {!isMobile && <MouseRig animate={animate} />}
    </Canvas>
  );
}
