"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

interface GlobeVisualizationProps {
  locations: TransformedLocation[];
}

const useSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size] as const;
};

export default function GlobeVisualization({ locations }: GlobeVisualizationProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [containerRef, size] = useSize();

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.6;
    }
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointColor={() => "#FF5733"}
        pointLabel="name"
        pointsData={locations}
        pointRadius={0.5}
        pointAltitude={0.1}
        pointsMerge={true}
        width={size.width}
        height={size.height}
      />
    </div>
  );
}