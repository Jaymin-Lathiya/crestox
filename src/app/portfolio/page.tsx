"use client";

import React, { useState } from 'react';
import { FeatureCarousel } from "@/components/ui/feature-carousel"
import SidePanel from '@/components/ui/side-panel';
import { Button } from '@/components/ui/button';
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ArtworksTab } from "@/components/dashboard/ArtworksTab";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";


export default function CollectionPage() {

    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("overview");

     const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "artworks":
        return <ArtworksTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };


    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">

                 <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardShell>
                    <section className="py-10">
                    <FeatureCarousel
                        title="How Crestox Works"
                        description="A simple, secure certificate workflow"
                        image={{
                            step1light1: "/images/step1-1.png",
                            step1light2: "/images/step1-2.png",
                            step2light1: "/images/step2-1.png",
                            step2light2: "/images/step2-2.png",
                            step3light: "/images/step3.png",
                            step4light: "/images/step4.png",
                            alt: "Feature carousel demo"
                        }}
                    />
                </section>

                <SidePanel
                    panelOpen={open}
                    handlePanelOpen={() => setOpen(!open)}
                    renderButton={(toggle) => (
                        <Button onClick={toggle} className='rounded-lg'>
                            {open ? "Close Panel" : "Open Panel"}
                        </Button>
                    )}
                >
                    <section className="py-10">
                        <video controls preload="none">
                            <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
                            <track
                                src="/path/to/captions.vtt"
                                kind="subtitles"
                                srcLang="en"
                                label="English"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </section>
                </SidePanel>
            </div>
        </div>
    );
}
