"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';
import { useAppStore, Artwork } from '@/store/useAppStore';

interface ArtworkPlaneProps {
  artwork: Artwork;
  position: [number, number, number];
  index: number;
  onSelect: (artwork: Artwork) => void;
}

function ArtworkPlane({ artwork, position, index, onSelect }: ArtworkPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Load texture with error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(
      artwork.imageUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      () => {
        setLoadError(true);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [artwork.imageUrl]);

  // Calculate size based on volume
  const volumeScale = Math.log10(artwork.volume24h) / 7;
  const baseSize = 6 + volumeScale * 3;

  // Determine glow color based on price change
  const glowColor = artwork.priceChange24h >= 0
    ? new THREE.Color(0xCCFF00)
    : new THREE.Color(0xFF2A6D);

  const glowIntensity = Math.min(Math.abs(artwork.priceChange24h) / 20, 0.8);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;

      if (hovered) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.15, 0.1);
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }
  });

  // Generate a color based on artwork id for fallback
  const fallbackColor = useMemo(() => {
    const hash = artwork.id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    return new THREE.Color().setHSL((Math.abs(hash) % 360) / 360, 0.6, 0.4);
  }, [artwork.id]);

  return (
    <group position={position}>
      {/* Glow plane behind artwork */}
      <mesh position={[0, 0, -0.3]} scale={[baseSize * 1.3, baseSize * 1.3, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? glowIntensity + 0.4 : glowIntensity + 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main artwork plane */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(artwork)}
        scale={[baseSize, baseSize, 1]}
      >
        <planeGeometry />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        ) : (
          <meshStandardMaterial
            color={loadError ? fallbackColor : '#1a1a1a'}
            side={THREE.DoubleSide}
            emissive={glowColor}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        )}
      </mesh>

      {/* Asset ID overlay */}
      <Html center position={[0, baseSize / 2 + 1, 0]} distanceFactor={20}>
        <div className="text-center pointer-events-none opacity-60">
          <span className="text-primary font-mono text-xs tracking-widest">{artwork.id}</span>
        </div>
      </Html>

      {/* Price overlay on hover */}
      {hovered && (
        <Html center position={[0, -baseSize / 2 - 2, 0]} distanceFactor={15}>
          <div className="bg-background/95 backdrop-blur-sm border border-border px-4 py-3 pointer-events-none min-w-[200px]">
            <p className="text-foreground font-serif text-base italic mb-1">"{artwork.title}"</p>
            <p className="text-muted-foreground font-mono text-xs tracking-widest mb-2">{artwork.artist.toUpperCase()}</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-foreground font-mono text-lg font-bold">₹{artwork.pricePerShard.toLocaleString()}</span>
              <span className={`font-mono text-sm font-bold ${artwork.priceChange24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {artwork.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(artwork.priceChange24h).toFixed(1)}%
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ArtworkGalaxy() {
  const { artworks, setSelectedArtwork, setCurrentView, setIsExploded } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);

  // Arrange artworks in a spiral galaxy formation
  const artworkPositions = useMemo(() => {
    return artworks.map((_, index) => {
      const angle = (index / artworks.length) * Math.PI * 4;
      const radius = 15 + index * 5;
      const x = Math.cos(angle) * radius * 0.6;
      const y = Math.sin(angle) * 4;
      const z = -index * 20;
      return [x, y, z] as [number, number, number];
    });
  }, [artworks]);

  const handleSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsExploded(false);
    setCurrentView('detail');
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {artworks.map((artwork, index) => (
        <ArtworkPlane
          key={artwork.id}
          artwork={artwork}
          position={artworkPositions[index]}
          index={index}
          onSelect={handleSelect}
        />
      ))}
      <AmbientParticles />
    </group>
  );
}

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.random() * -150;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color={0xCCFF00}
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function MarketplaceHUD() {
  const { artworks, setCurrentView } = useAppStore();

  const totalVolume = artworks.reduce((acc, a) => acc + a.volume24h, 0);
  const avgChange = artworks.reduce((acc, a) => acc + a.priceChange24h, 0) / artworks.length;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Left - Brand */}
      <div className="hud-corner hud-top-left">
        <button
          className="pointer-events-auto text-foreground text-2xl font-bold tracking-[0.3em] font-mono hover:text-primary transition-colors"
          onClick={() => setCurrentView('home')}
        >
          CRESTOX
        </button>
        <div className="flex items-center gap-2 mt-2">
          <span className="pulse-dot" />
          <span className="text-primary text-xs font-mono tracking-widest uppercase">
            Galaxy View
          </span>
        </div>
      </div>

      {/* Top Right - Market Stats */}
      <div className="hud-corner hud-top-right">
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-xs font-mono tracking-widest">24H VOLUME</p>
            <p className="text-foreground font-mono text-xl">₹{(totalVolume / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-mono tracking-widest">AVG CHANGE</p>
            <p className={`font-mono text-xl ${avgChange >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-xs font-mono tracking-widest">
          HOVER TO PREVIEW • CLICK TO FRACTIONALIZE
        </p>
      </div>

      {/* Bottom Left - Asset Count */}
      <div className="hud-corner hud-bottom-left">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-mono">
            TOTAL ASSETS: <span className="text-foreground">{artworks.length}</span>
          </p>
          <p className="text-muted-foreground text-xs font-mono">
            MARKET CAP: <span className="text-primary">₹{(artworks.reduce((a, b) => a + b.marketCap, 0) / 10000000).toFixed(1)}Cr</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GalaxyMarketplace() {
  const { resolvedTheme } = useTheme();
  const backgroundColor = resolvedTheme === 'light' ? '#EBE6D6' : '#050505';

  return (
    <div className="w-full h-full">
      <MarketplaceHUD />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 40], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[backgroundColor]} />
        <fog attach="fog" args={[backgroundColor, 30, 150]} />

        <ambientLight intensity={0.6} />
        <pointLight position={[20, 20, 20]} intensity={1} />
        <pointLight position={[-20, -10, -30]} intensity={0.4} color={0xCCFF00} />
        <pointLight position={[0, 0, -50]} intensity={0.3} color={0x7B61FF} />

        <ArtworkGalaxy />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={20}
          maxDistance={100}
          autoRotate={false}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
