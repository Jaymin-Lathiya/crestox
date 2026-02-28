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
                            step1light1: "/assets/artwork-1.jpg",
                            step1light2: "/assets/artwork-2.jpg",
                            step2light1: "/assets/artwork-3.jpg",
                            step2light2: "/assets/artwork-4.jpg",
                            step3light: "/assets/artwork-5.jpg",
                            step4light: "/assets/artwork-6.jpg",
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
