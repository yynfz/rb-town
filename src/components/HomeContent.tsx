"use client";

import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import Link from "next/link";
import Image from "next/image";
import { WalletConnect } from "./WalletConnect";
import { SubmissionFlow } from "./SubmissionFlow";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SonarGrid } from "@/components/ui/sonar-grid";

const settings = {
  ringWidth: 90,
  speed: 260,
  amplitude: 2.2,
  pingEvery: 2.4,
  interactive: true,
  spacing: 26,
  baseOpacity: 0.28,
  useThemeColor: false,
  color: "#818cf8", // indigo-400 equivalent to match the theme
  eyebrow: "Reality Bridge",
  headline: "Bridging Recorded Data with Lived Reality.",
  subline: "Verify your identity with World ID to report shifts in your Lived Reality and create verifiable on-chain signals while keeping your personal data completely off-chain.",
};

export function HomeContent() {
  const { isConnected, chain } = useAccount();
  const isSepolia = chain?.id === sepolia.id;
  
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  if (isConnected && isSepolia) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12">
        <SubmissionFlow />
      </div>
    );
  }

  return (
    <SonarGrid
      id="sonar-grid-demo"
      ringWidth={settings.ringWidth}
      speed={settings.speed}
      amplitude={settings.amplitude}
      pingEvery={settings.pingEvery}
      interactive={settings.interactive}
      spacing={settings.spacing}
      baseOpacity={settings.baseOpacity}
      color={settings.useThemeColor ? undefined : settings.color}
      pingArea={[0.22, 0.18, 0.78, 0.82]}
      className="bg-background flex flex-1 w-full flex-col min-h-[max(600px,calc(100vh-69px))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_34%_30%_at_50%_50%,var(--color-background)_0%,transparent_100%)]"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-8 py-24 text-center">
        <div className="flex max-w-2xl flex-col items-center">
          <motion.div
            {...enter(0)}
            className="relative mb-6 flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />
            <Image
              src="/rb-logo-hq.png"
              alt="Reality Bridge Logo"
              width={80}
              height={80}
              className="relative rounded-2xl border border-white/10 shadow-2xl object-cover"
            />
          </motion.div>
          <motion.p
            {...enter(0.04)}
            className="text-muted-foreground border-white/10 bg-white/5 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur"
          >
            <span aria-hidden="true" className="bg-indigo-500 size-1.5 rounded-full" />
            {settings.eyebrow}
          </motion.p>
          <motion.h2
            {...enter(0.08)}
            className="text-white text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
          >
            Bridging Recorded Data with <span className="text-indigo-400">Lived Reality.</span>
          </motion.h2>
          <motion.p {...enter(0.16)} className="text-slate-300 mt-6 max-w-xl text-base text-pretty sm:text-lg">
            {settings.subline}
          </motion.p>
          <motion.div {...enter(0.24)} className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 relative z-10">
            <div className="[&>button]:!h-11 [&>button]:!rounded-full [&>button]:!px-6">
              <WalletConnect />
            </div>
            <Link
              href="/observatory"
              data-slot="cta-secondary"
              className="group bg-background/70 text-white border-white/20 hover:bg-white/10 focus-visible:ring-indigo-500/50 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-6 text-sm font-medium backdrop-blur transition-[background-color,transform] duration-200 outline-none focus-visible:ring-[3px] active:scale-[0.98]"
            >
              View Observatory
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </SonarGrid>
  );
}
