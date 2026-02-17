"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full py-12 md:py-24 lg:py-32 bg-background border-t border-border/40 relative overflow-hidden">
            {/* Background Gradients/Glows to match theme */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Logo Icon Placeholder - keeping it text for now as per header */}
                            <h2 className="text-2xl font-bold tracking-tighter font-serif text-foreground">
                                Crestox
                            </h2>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-sans">
                            Crestox provides a set of reusable components and utilities to help you
                            create beautiful and responsive user interfaces quickly and efficiently.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-[#3B82F6] uppercase">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Updates
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-[#3B82F6] uppercase">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-[#3B82F6] uppercase">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/40 text-center">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Crestox. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
