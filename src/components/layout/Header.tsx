"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Info,
  Mail,
  Map,
  Moon,
  Package,
  ScrollText,
  Sun,
  SunMoon,
  WandSparkles,
} from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "../ui/dock";
import { useTheme } from "next-themes";
import { useThemeToggle } from "@/components/ui/skiper/skiper26";
import GradientButton from "../ui/gradiant-button";
import ProfileDropdown from "../ui/profile";
import { clearCookie, getCookie } from "@/utils/cookieUtils";
import { useUserStore } from "@/store/useUserStore";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { toggleTheme } = useThemeToggle({
    variant: "circle",
    start: "top-left",
    blur: true,
  });

  const token = getCookie("token");
  const { fetchProfile, user } = useUserStore();

  React.useEffect(() => {
    if (token !== undefined && token !== "") {
      setIsLoggedIn(true);
      fetchProfile();
    }
  }, [token, fetchProfile]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    {
      title: "Explore",
      icon: (
        <Compass className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      href: "/explore",
    },
    {
      title: "Products",
      icon: (
        <WandSparkles className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      href: "/ai-curator",
    },
    {
      title: "About Us",
      icon: (
        <Info className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      href: "/about-us",
    },
    {
      title: "Theme",
      icon:
        mounted ?
          theme === "dark" ?
            <Moon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
            : <Sun className="h-full w-full text-neutral-600 dark:text-neutral-300" />
          : <SunMoon className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      type: "theme",
    },
  ];

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 px-6 py-3 md:py-4 bg-background/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <h1 className="text-foreground text-xl font-bold tracking-[0.3em] font-mono">
              CRESTOX
            </h1>
          </div>

          {/* <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/app"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Explore
                    </Link>
                    <Link
                        href="/ai-curator"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        AI Curator
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About Us
                    </Link>
                    </div> */}

          <div className="absolute top-1/2 left-1/2 max-w-full -translate-x-1/2 -translate-y-1/2 hidden lg:flex">
            <Dock direction="middle" className="items-center">
              {data.map((item, idx) => (
                <DockItem
                  key={idx}
                  className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
                  onClick={() => {
                    if (item.type === "theme") {
                      toggleTheme();
                    } else if (item.href) {
                      router.push(item.href);
                    }
                  }}
                >
                  <DockLabel>{item.title}</DockLabel>
                  {/* <DockIcon className="text-[10px] font-medium">{item.title}</DockIcon> */}
                  <DockIcon>{item.icon}</DockIcon>
                </DockItem>
              ))}
            </Dock>
          </div>

          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}

            {isLoggedIn ?
              <ProfileDropdown
                logout={() => {
                  clearCookie("token");
                  setIsLoggedIn(false);
                }}
              />
              : <div className="flex items-center gap-2">
                <GradientButton
                  label="Sign In"
                  variant="primary"
                  className="h-10 px-3 md:h-12 md:px-6 text-xs md:text-sm"
                  onClick={() => router.push("/login")}
                ></GradientButton>
                {/* <GradientButton
                                    variant="secondary"
                                    className="flex text-[10px] md:text-xs h-10 px-2 md:h-12 md:px-3 whitespace-nowrap"
                                    onClick={() => setIsLoggedIn(true)}
                                    label="Test Login"
                                >
                                </GradientButton> */}
              </div>
            }
          </div>
        </div>
      </nav>
      {/* Desktop Dock — lg and above */}
      <div className="absolute top-1/2 left-1/2 max-w-full -translate-x-1/2 -translate-y-1/2 hidden lg:flex">
        <Dock className="items-end pb-3">
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800"
              onClick={() => {
                if (item.type === "theme") toggleTheme();
                else if (item.href) router.push(item.href);
              }}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      {/* Mobile/Tablet Bottom Nav — below lg */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-background/80 backdrop-blur-lg border border-border/50 shadow-sm">
          {data.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.type === "theme") toggleTheme();
                else if (item.href) router.push(item.href);
              }}
              className="flex flex-col items-center gap-1 shrink-0 w-12" // 👈 fixed width
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800">
                <div className="w-5 h-5 text-neutral-600 dark:text-neutral-300">
                  {item.icon}
                </div>
              </div>
              <span className="text-[10px] text-neutral-600 dark:text-neutral-300 leading-none text-center w-full">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
