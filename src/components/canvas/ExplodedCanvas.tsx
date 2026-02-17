"use client";

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import { useTheme } from 'next-themes';

// DLS Constants
const GRID_SIZE = 50;
const TOTAL_SHARDS = GRID_SIZE * GRID_SIZE;
const ANIMATION_SPEED = 2.0;

interface ArtworkShardsProps {
  exploded: boolean;
  textureUrl: string;
}

// GLSL Shaders
const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uGridSize;

  attribute vec2 aGridPosition;
  attribute float aRandom;

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                                0.0,                                0.0,                                1.0
    );
  }

  float cubicOut(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  void main() {
    vec2 uvOffset = aGridPosition;
    vec2 cellUv = uv / uGridSize;
    vUv = uvOffset + cellUv;

    vec3 transformed = position;

    vec3 explodeDir = vec3(aGridPosition - 0.5, 0.0);
    explodeDir.x += (aRandom - 0.5) * 0.2;
    explodeDir.y += (aRandom - 0.5) * 0.2;

    float zDepth = (aRandom - 0.5) * 2.0;
    explodeDir.z += zDepth;

    float easedProgress = cubicOut(uProgress);
    vec3 movement = normalize(explodeDir) * uProgress * 20.0;

    float rotationAngle = uProgress * aRandom * 15.0;
    vec3 rotationAxis = vec3(aRandom, random(vec2(aRandom, 1.0)), random(vec2(aRandom, 2.0)));
    mat4 rotMat = rotationMatrix(rotationAxis, rotationAngle);

    transformed = (rotMat * vec4(transformed, 1.0)).xyz;

    vec3 gridOffset = vec3((aGridPosition * uGridSize) - (uGridSize * 0.5), 0.0);
    vec3 finalPosition = gridOffset + transformed + movement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTexture, vUv);

    if (uProgress > 0.1) {
      float edge = 0.02;
      if (vUv.x < edge || vUv.y < edge || vUv.x > 1.0 - edge || vUv.y > 1.0 - edge) {
        color.rgb += vec3(0.8, 1.0, 0.0) * uProgress * 0.5;
      }
    }

    gl_FragColor = color;
  }
`;

function ArtworkShards({ exploded, textureUrl }: ArtworkShardsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture with crossOrigin
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      textureUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      (error) => {
        console.error('Texture loading error:', error);
      }
    );
  }, [textureUrl]);

  const { gridPositions, randoms } = useMemo(() => {
    const gridPositions = new Float32Array(TOTAL_SHARDS * 2);
    const randoms = new Float32Array(TOTAL_SHARDS);

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const index = i * GRID_SIZE + j;
        gridPositions[index * 2] = i / GRID_SIZE;
        gridPositions[index * 2 + 1] = j / GRID_SIZE;
        randoms[index] = Math.random();
      }
    }
    return { gridPositions, randoms };
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      const target = exploded ? 1 : 0;
      const current = materialRef.current.uniforms.uProgress.value;
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        current,
        target,
        delta * ANIMATION_SPEED
      );
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture || new THREE.Texture() },
      uProgress: { value: 0 },
      uGridSize: { value: new THREE.Vector2(GRID_SIZE, GRID_SIZE) },
      uTime: { value: 0 },
    }),
    [texture]
  );

  // Update texture uniform when loaded
  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
      materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.setAttribute(
      'aGridPosition',
      new THREE.InstancedBufferAttribute(gridPositions, 2)
    );
    geo.setAttribute(
      'aRandom',
      new THREE.InstancedBufferAttribute(randoms, 1)
    );
    return geo;
  }, [gridPositions, randoms]);

  if (!texture) {
    return (
      <Html center>
        <div className="text-primary font-mono text-sm tracking-widest animate-pulse">
          LOADING ASSET...
        </div>
      </Html>
    );
  }

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, TOTAL_SHARDS]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </instancedMesh>
  );
}

interface ExplodedCanvasProps {
  exploded: boolean;
  onToggle: () => void;
  artworkUrl: string;
}

export default function ExplodedCanvas({ exploded, onToggle, artworkUrl }: ExplodedCanvasProps) {
  const { resolvedTheme } = useTheme();
  const backgroundColor = resolvedTheme === 'light' ? '#EBE6D6' : '#050505';

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 80], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onClick={onToggle}
      className="cursor-pointer"
    >
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} />

      <ArtworkShards exploded={exploded} textureUrl={artworkUrl} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={40}
        maxDistance={150}
        autoRotate={exploded}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
