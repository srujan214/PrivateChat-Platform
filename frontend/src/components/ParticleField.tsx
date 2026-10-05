import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const init = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

export default function ParticleField() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 60 },
        color: { value: ["#B57EDC", "#FF8FB1", "#FFFFFF"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.15, max: 0.55 } },
        size: { value: { min: 0.6, max: 2.6 } },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none" as const,
          random: true,
          outModes: { default: "out" as const },
        },
        links: {
          enable: true,
          distance: 140,
          color: "#B57EDC",
          opacity: 0.18,
          width: 1,
        },
      },
      interactivity: {
        detectsOn: "window" as const,
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.5 } },
          push: { quantity: 3 },
        },
      },
    }),
    []
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <ParticlesProvider init={init}>
        <Particles id="tsparticles" options={options} />
      </ParticlesProvider>
    </div>
  );
}