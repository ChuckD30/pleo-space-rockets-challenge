import React from "react";
import Particles from "react-tsparticles";
import { particlesConfig } from "../utils/particles-config";

export default function ParticleBackground() {
  return (
    <Particles
      id="tsparticles"
      options={particlesConfig}
      style={{
        zIndex: `-1 !important`,
      }}
    />
  );
}
