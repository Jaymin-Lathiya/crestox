"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Wallet,
    LayoutGrid,
    BookOpen,
    Settings,
    Shield,
    LogOut,
} from "lucide-react"



interface Profile {
    name: string
    email: string
    avatar?: string
}



const SAMPLE_PROFILE_DATA: Profile = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
}


interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: Profile
    logout: () => void
}

export default function ProfileDropdown({
    data = SAMPLE_PROFILE_DATA,
    className,
    logout,
    ...props
}: ProfileDropdownProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-3 md:gap-16 p-1.5 md:px-3 rounded-full md:rounded-2xl bg-transparent md:bg-white md:dark:bg-zinc-900 md:border md:border-zinc-200/60 md:dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-200 focus:outline-none"
                        >
                            <div className="text-left flex-1 hidden md:block">
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {data.name}
                                </div>
                                {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {data.email}
                                </div> */}
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center text-xs font-semibold">
                                        {data.avatar ? (
                                            <Image
                                                src={data.avatar}
                                                alt={data.name}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span>{data.name.slice(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <div
                        className={cn(
                            "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                            isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                        )}
                    >
                        <svg
                            width="12"
                            height="24"
                            viewBox="0 0 12 24"
                            fill="none"
                            className={cn(
                                "transition-all duration-200",
                                isOpen
                                    ? "text-blue-500 dark:text-blue-400 scale-110"
                                    : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                            )}
                            aria-hidden="true"
                        >
                            <path
                                d="M2 4C6 8 6 16 2 20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* ========= Dropdown Content ========= */}
                    <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="w-64 p-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl"
                    >
                        {/* User Info */}
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium">{data.name}</p>
                            <p className="text-xs text-muted-foreground">{data.email}</p>
                        </div>

                        <DropdownMenuSeparator />

                        {/* Balance */}
                        <DropdownMenuItem className="flex justify-between items-center rounded-xl px-3 py-2">
                            <div className="flex items-center">
                                <Wallet className="mr-2 h-4 w-4" />
                                <span>Balance</span>
                            </div>
                            <span className="font-mono text-xs font-bold text-primary">
                                ₹4,520
                            </span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Navigation */}
                        <DropdownMenuItem
                            className="rounded-xl px-3 py-2"
                            onClick={() => router.push("/collection")}
                        >
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            <span>My Collection</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="rounded-xl px-3 py-2"
                            onClick={() => router.push("/portfolio")}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>My Portfolio</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="rounded-xl px-3 py-2"
                            onClick={() => router.push("/subscription")}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Manage Subscription</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="rounded-xl px-3 py-2"
                            onClick={() => router.push("/terms")}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Terms & Policies</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Logout */}
                        <DropdownMenuItem
                            className="rounded-xl px-3 py-2 text-destructive focus:text-destructive"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    )
}
