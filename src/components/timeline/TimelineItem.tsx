"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import CardFlip from "../ui/card-flip"

type TimelineStep = {
    step: string
    title: string
    description: string
}

const steps: TimelineStep[] = [
    {
        step: "01",
        title: "Choose Your Certificate",
        description: "Select the SSL certificate that fits your domain needs.",
    },
    {
        step: "02",
        title: "Submit Details",
        description: "Provide domain and organization information securely.",
    },
    {
        step: "03",
        title: "Verification & Issuance",
        description: "We verify and issue your certificate within minutes.",
    },
]

export function HowItWorksTimeline() {
    return (
        <div className="relative max-w-5xl mx-auto px-4">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-600/50 dark:via-cyan-500/50 to-transparent md:-translate-x-1/2" />

            {steps.map((item, index) => (
                <div key={index} className={cn(
                    "relative flex items-center justify-between mb-24 last:mb-0",
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}>
                    <div className="hidden md:block w-1/2" />

                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-4 h-4">
                        <div className="w-3 h-3 rounded-full bg-white dark:bg-black border border-yellow-600 dark:border-yellow-500 shadow-[0_0_10px_rgba(202,138,4,0.5)] dark:shadow-[0_0_10px_rgba(234,179,8,0.5)] z-10" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className={cn(
                            "w-full md:w-[45%] pl-16 md:pl-0",
                            index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                        )}
                    >
                        {/* <div className={cn(
                            "relative p-6 rounded-xl transition-colors group",
                            "bg-white/80 border border-zinc-200 shadow-md",
                            "dark:bg-zinc-900/50 dark:border-white/5 dark:backdrop-blur-sm dark:shadow-none",
                            "hover:border-cyan-500/50 dark:hover:border-white/10",
                            "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                            <span className="relative block text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2 tracking-wider">
                                {item.step}
                            </span>

                            <h3 className="relative text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                {item.title}
                            </h3>

                            <p className="relative text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div> */}
                        <CardFlip />
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
