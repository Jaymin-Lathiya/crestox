"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/store/useAppStore';

interface OwnedArtwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  shardsOwned: number;
  totalShards: number;
  currentValue: number;
  purchasePrice: number;
}

const OWNED_ARTWORKS: OwnedArtwork[] = [
  {
    id: '#001-ALPHA',
    title: 'The Liquid Abstract',
    artist: 'Elena Vostok',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop',
    shardsOwned: 150,
    totalShards: 3600,
    currentValue: 375000,
    purchasePrice: 300000,
  },
  {
    id: '#003-GAMMA',
    title: 'Digital Renaissance',
    artist: 'Sophia Laurent',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop',
    shardsOwned: 75,
    totalShards: 2500,
    currentValue: 315000,
    purchasePrice: 280000,
  },
  {
    id: '#006-ZETA',
    title: 'Chromatic Pulse',
    artist: 'Ava Sterling',
    imageUrl: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=800&auto=format&fit=crop',
    shardsOwned: 200,
    totalShards: 6000,
    currentValue: 190000,
    purchasePrice: 170000,
  },
];

interface VinylRecordProps {
  artwork: OwnedArtwork;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function VinylRecord({ artwork, index, selectedIndex, onSelect }: VinylRecordProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture with error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(
      artwork.imageUrl,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fail silently, will use fallback color
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [artwork.imageUrl]);

  const isSelected = index === selectedIndex;
  const offset = index - selectedIndex;

  // Generate fallback color
  const fallbackColor = useMemo(() => {
    const hash = artwork.id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    return new THREE.Color().setHSL((Math.abs(hash) % 360) / 360, 0.5, 0.35);
  }, [artwork.id]);

  useFrame(() => {
    if (meshRef.current) {
      const targetY = offset * 1;
      const targetZ = offset * -3;
      const targetRotX = isSelected ? 0 : -0.4;

      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);

      if (isSelected) {
        meshRef.current.rotation.y += 0.004;
      }
    }
  });

  const roi = ((artwork.currentValue - artwork.purchasePrice) / artwork.purchasePrice) * 100;

  return (
    <group>
      <mesh ref={meshRef} onClick={() => onSelect(index)}>
        <cylinderGeometry args={[5, 5, 0.15, 64]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={isSelected ? 1 : 0.6}
          />
        ) : (
          <meshStandardMaterial
            color={fallbackColor}
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={isSelected ? 1 : 0.6}
          />
        )}
      </mesh>

      {isSelected && (
        <Html center position={[0, -7, 0]} distanceFactor={20}>
          <div className="bg-background/95 backdrop-blur-sm border border-border px-6 py-4 min-w-[280px] text-center">
            <h3 className="text-foreground font-serif text-xl italic mb-1">"{artwork.title}"</h3>
            <p className="text-muted-foreground font-mono text-xs tracking-widest mb-4">
              BY {artwork.artist.toUpperCase()}
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-muted-foreground font-mono text-xs">SHARDS</p>
                <p className="text-foreground font-mono text-lg">
                  {artwork.shardsOwned} <span className="text-muted-foreground text-sm">/ {artwork.totalShards}</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-mono text-xs">VALUE</p>
                <p className="text-foreground font-mono text-lg">₹{(artwork.currentValue / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-muted-foreground font-mono text-xs">COST BASIS</p>
                <p className="text-muted-foreground font-mono">₹{(artwork.purchasePrice / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-muted-foreground font-mono text-xs">ROI</p>
                <p className={`font-mono text-lg font-bold ${roi >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PortfolioFloor() {
  const totalValue = OWNED_ARTWORKS.reduce((acc, a) => acc + a.currentValue, 0);

  return (
    <group position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[12, 64]} />
        <meshBasicMaterial color={0xCCFF00} transparent opacity={0.08} />
      </mesh>

      <Html center position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <div className="text-center pointer-events-none">
          <p className="text-muted-foreground font-mono text-xs tracking-widest mb-1">PORTFOLIO VALUE</p>
          <p className="text-primary font-mono text-3xl font-bold text-glow-lime">
            ₹{(totalValue / 100000).toFixed(2)}L
          </p>
        </div>
      </Html>
    </group>
  );
}

function VaultScene() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      {OWNED_ARTWORKS.map((artwork, index) => (
        <VinylRecord
          key={artwork.id}
          artwork={artwork}
          index={index}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      ))}
      <PortfolioFloor />
    </>
  );
}

function VaultHUD() {
  const { setCurrentView } = useAppStore();
  const totalValue = OWNED_ARTWORKS.reduce((acc, a) => acc + a.currentValue, 0);
  const totalInvested = OWNED_ARTWORKS.reduce((acc, a) => acc + a.purchasePrice, 0);
  const totalRoi = ((totalValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
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
            The Vault
          </span>
        </div>
      </div>

      <div className="hud-corner hud-top-right">
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-xs font-mono tracking-widest">HOLDINGS</p>
            <p className="text-foreground font-mono text-xl">{OWNED_ARTWORKS.length} ASSETS</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-mono tracking-widest">TOTAL ROI</p>
            <p className={`font-mono text-xl font-bold ${totalRoi >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {totalRoi >= 0 ? '+' : ''}{totalRoi.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-xs font-mono tracking-widest">
          CLICK TO SELECT • DRAG TO ROTATE
        </p>
      </div>
    </div>
  );
}

export default function VaultDashboard() {
  const { resolvedTheme } = useTheme();
  const backgroundColor = resolvedTheme === 'light' ? '#EBE6D6' : '#050505';

  return (
    <div className="w-full h-full">
      <VaultHUD />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 5, 18], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[backgroundColor]} />

        <ambientLight intensity={0.5} />
        <spotLight position={[0, 15, 0]} intensity={1.2} angle={0.6} penumbra={1} />
        <pointLight position={[8, 8, 8]} intensity={0.4} color={0xCCFF00} />

        <VaultScene />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={12}
          maxDistance={35}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
