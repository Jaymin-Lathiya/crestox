"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, User, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getFeaturedArtists, getAllArtists, type FeaturedArtist } from '@/apis/artists/artistActions';
import { createPortal } from 'react-dom';

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop';

type CreatorItem = {
    id?: number;
    name: string;
    role?: string;
    image: string;
    bio: string;
    stats: { label: string; value: number; max: number };
};

const CREATOR_TABS = [
    { id: 'artists', label: 'Featured Artists', icon: User },
    { id: 'curators', label: 'Featured Curators', icon: Award },
    { id: 'owners', label: 'Featured Owners', icon: ShieldCheck },
];

const MOCK_CREATORS = {
    artists: [
        {
            name: 'Priya Patel',
            role: 'Digital Surrealist',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            bio: 'An esteemed artist from Gujarat, known for a unique and captivating style that blends traditional motifs with modern digital...',
            stats: { label: 'Fractals Available', value: 795, max: 795 }
        },
        {
            name: 'Rohan Mehta',
            role: 'Abstract Painter',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            bio: 'Master of texture and light, creating immersive abstract landscapes that challenge perception and reality.',
            stats: { label: 'Fractals Available', value: 490, max: 490 }
        },
        {
            name: 'Aarav Shah',
            role: 'NFT Pioneer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
            bio: 'Bridging the gap between physical and digital ownership through innovative smart contract art.',
            stats: { label: 'Fractals Available', value: 365, max: 365 }
        },
        {
            name: 'Isha Joshi',
            role: 'Geometric Artist',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
            bio: 'Exploring the mathematical beauty of sacred geometry in the digital age.',
            stats: { label: 'Fractals Available', value: 405, max: 405 }
        },
        {
            name: 'David L.',
            role: 'Glitch Artist',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
            bio: 'Deconstructing digital signals to create visual noise that speaks volumes.',
            stats: { label: 'Fractals Available', value: 200, max: 500 }
        },
        {
            name: 'Maria G.',
            role: 'Traditional Fine Art',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
            bio: 'Classical techniques applied to contemporary subjects, preserving heritage in the blockchain.',
            stats: { label: 'Fractals Available', value: 150, max: 300 }
        },
    ],
    curators: [],
    owners: []
};

function CreatorCardSkeleton() {
    return (
        <div className="group relative bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col items-center text-center h-[280px] justify-between">
            <div className="relative mb-4 flex flex-col items-center w-full">
                <Skeleton className="w-16 h-16 rounded-full mb-3" />
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
            </div>
            <div className="w-full mt-auto mb-4">
                <div className="flex justify-between items-end mb-2">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-2 w-8" />
                </div>
                <Skeleton className="h-1 w-full rounded-full" />
            </div>
            <Skeleton className="h-8 w-full rounded-md" />
        </div>
    );
}

function mapFeaturedArtistToCreator(artist: any): CreatorItem {
    const total = artist.total_fractals ?? 100;
    const available = artist.available_fractals ?? 50;
    const max = total;

    return {
        id: artist.artist_profile_id || artist.id,
        name: artist.artist_name || artist.user?.name || 'Unknown Artist',
        role: 'Artist',
        image: artist.avatar_url || artist.avatar_media?.file_path || PLACEHOLDER_AVATAR,
        bio: artist.artist_bio || 'Featured artist on Crestox.',
        stats: {
            label: 'Fractals Available',
            value: available,
            max,
        },
    };
}

interface CreatorCardProps {
    creator: CreatorItem;
    onShowMore: (bio: string, name: string) => void;
}

function CreatorCard({ creator, onShowMore }: CreatorCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(prev => !prev);
    };

    const isLongBio = creator.bio && creator.bio.length > 120;
    const displayedBio = isLongBio ? `${creator.bio.slice(0, 110)}...` : creator.bio;

    return (
        <div
            className="group [perspective:1000px] cursor-pointer w-full h-[280px]"
            onClick={handleFlip}
        >
            <div
                className={cn(
                    "relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d]",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                )}
            >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full bg-card/40 hover:bg-card/60 border border-border/50 hover:border-primary/30 rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:shadow-lg hover:shadow-primary/5 [backface-visibility:hidden]">
                    <div className="flex flex-col items-center w-full">
                        <div className="relative mb-3">
                            <div className="w-16 h-16 rounded-full p-0.5 border border-border/50 group-hover:border-primary/50 transition-colors">
                                <img
                                    src={creator.image}
                                    alt={creator.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                {creator.name.slice(0, 2)}
                            </div>
                        </div>

                        <h3 className="font-serif text-base font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {creator.name}
                        </h3>
                        <p className="text-[10px] terminal-text text-muted-foreground">
                            {creator.role || 'Artist'}
                        </p>
                    </div>

                    <div className="w-full mt-auto mb-4">
                        <div className="flex justify-between items-end mb-1.5 text-[10px]">
                            <span className="text-muted-foreground">{creator.stats.label}</span>
                            <span className="font-mono font-medium text-foreground">
                                {creator.stats.value} / {creator.stats.max}
                            </span>
                        </div>
                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_var(--primary)]"
                                style={{ width: `${creator.stats.max > 0 ? (creator.stats.value / creator.stats.max) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    {creator.id != null ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs border-border hover:border-primary group-hover:bg-primary/5 transition-all"
                            asChild
                            onClick={(e) => e.stopPropagation()} // Avoid flipping card
                        >
                            <Link href={`/artist/${creator.id}`}>View Profile</Link>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs border-border hover:border-primary group-hover:bg-primary/5 transition-all"
                            onClick={(e) => e.stopPropagation()} // Avoid flipping card
                        >
                            View Profile
                        </Button>
                    )}
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full bg-card/90 border border-primary/30 rounded-2xl p-4 flex flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="w-full flex flex-col items-center flex-grow">
                        <h4 className="font-serif text-sm font-semibold text-primary mb-2">
                            About {creator.name}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed text-center overflow-y-auto max-h-[130px] pr-1 scrollbar-thin">
                            {displayedBio}
                        </p>

                        {isLongBio && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Avoid flipping card
                                    onShowMore(creator.bio, creator.name);
                                }}
                                className="mt-2 text-[10px] font-mono text-primary hover:underline"
                            >
                                Show More
                            </button>
                        )}
                    </div>

                    <div className="w-full flex gap-2 mt-auto">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlip();
                            }}
                            className="flex-grow h-8 text-[10px] font-mono border border-border/60 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Back
                        </button>
                        {creator.id != null ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-grow h-8 text-[10px] border-border hover:border-primary group-hover:bg-primary/5 transition-all"
                                asChild
                                onClick={(e) => e.stopPropagation()} // Avoid flipping card
                            >
                                <Link href={`/artist/${creator.id}`}>Profile</Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-grow h-8 text-[10px] border-border hover:border-primary group-hover:bg-primary/5 transition-all"
                                onClick={(e) => e.stopPropagation()} // Avoid flipping card
                            >
                                Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeaturedCreators() {
    const [activeTab, setActiveTab] = useState('artists');
    const [isExpanded, setIsExpanded] = useState(false);
    const [displayedCreators, setDisplayedCreators] = useState<CreatorItem[]>([]);
    const [isLoadingArtists, setIsLoadingArtists] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedBio, setSelectedBio] = useState<{ bio: string; name: string } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // When artists grid height changes (browse all / collapse), scroll-linked sections below must remeasure.
    useEffect(() => {
        let cancelled = false;
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!cancelled) {
                    window.dispatchEvent(new CustomEvent("crestox:explore-layout"));
                }
            });
        });
        return () => {
            cancelled = true;
            cancelAnimationFrame(id);
        };
    }, [isExpanded, isLoadingArtists, activeTab, displayedCreators.length]);

    const loadFeaturedArtists = async () => {
        setIsLoadingArtists(true);
        try {
            const artists = await getFeaturedArtists()();
            setDisplayedCreators(artists.map(mapFeaturedArtistToCreator));
        } catch (error) {
            console.error("Failed to load featured artists:", error);
            setDisplayedCreators([]);
        } finally {
            setIsLoadingArtists(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'artists') {
            loadFeaturedArtists();
        } else {
            const creators = MOCK_CREATORS[activeTab as keyof typeof MOCK_CREATORS];
            const shuffled = [...creators].sort(() => 0.5 - Math.random());
            setDisplayedCreators(shuffled);
        }
    }, [activeTab]);

    const loadAllArtists = async () => {
        setIsLoadingArtists(true);
        try {
            const response = await getAllArtists({ page: 1, limit: 999999, isApproved: true })();
            // The API returns paginated data inside a 'list' property
            let artistsData: any[] = [];
            if (Array.isArray(response)) {
                artistsData = response;
            } else if (response && Array.isArray(response.list)) {
                artistsData = response.list;
            } else if (response && Array.isArray(response.data)) {
                artistsData = response.data;
            }

            // Map the new artists and filter out any that are already displayed as featured
            const loadedCreators = artistsData.map(mapFeaturedArtistToCreator);

            setDisplayedCreators(prev => {
                const existingIds = new Set(prev.map(c => c.id));
                const newCreators = loadedCreators.filter(c => !existingIds.has(c.id));
                return [...prev, ...newCreators];
            });
            setIsExpanded(true);
        } catch (error) {
            console.error("Failed to load all artists:", error);
        } finally {
            setIsLoadingArtists(false);
        }
    };

    const handleBrowseAllClick = () => {
        if (activeTab === 'artists') {
            if (!isExpanded) {
                loadAllArtists();
            } else {
                // Collapse back to original featured artists list by re-fetching featured artists API
                setIsExpanded(false);
                loadFeaturedArtists();
            }
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    const visibleCreators = (!isExpanded && activeTab === 'artists') ? displayedCreators.slice(0, 4) : displayedCreators;
    const showStickyCollapse = mounted && isExpanded && activeTab === "artists";

    const collapseButton = (
        <button
            onClick={handleBrowseAllClick}
            className={cn(
                "flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest border border-border/50 rounded-full px-8 py-3 hover:bg-secondary/50 group",
                showStickyCollapse && "bg-background/85 backdrop-blur-md shadow-lg"
            )}
        >
            {isExpanded ? (
                <>Collapse <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /></>
            ) : (
                <>Browse All {CREATOR_TABS.find(t => t.id === activeTab)?.label.replace('Featured ', '')} <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></>
            )}
        </button>
    );

    return (
        <section className="mb-16 animate-fade-in-up delay-100">
            <div
                className={cn(
                    "flex items-center justify-center gap-8 mb-12 border-b border-border/40 pb-4 overflow-x-auto no-scrollbar",
                    isExpanded && activeTab === "artists" && "sticky top-20 z-30 bg-background/95 backdrop-blur-md pt-3"
                )}
            >
                {CREATOR_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsExpanded(false); }}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap text-sm tracking-[0.1em] uppercase transition-all duration-300 pb-2 relative",
                            activeTab === tab.id
                                ? "text-primary font-bold"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4 mb-0.5", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {isLoadingArtists && activeTab === 'artists' && !isExpanded ? (
                    // Initial load or tab switch: full skeletons
                    Array.from({ length: 6 }).map((_, i) => <CreatorCardSkeleton key={i} />)
                ) : (
                    <>
                        {visibleCreators.length === 0 ? (
                            <div className="col-span-full py-16 flex justify-center">
                                <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                                    No {activeTab} available
                                </p>
                            </div>
                        ) : visibleCreators.map((creator, idx) => (
                            <CreatorCard
                                key={creator.id ?? idx}
                                creator={creator}
                                onShowMore={(bio, name) => setSelectedBio({ bio, name })}
                            />
                        ))}

                        {isLoadingArtists && activeTab === 'artists' && isExpanded && (
                            // Appended skeletons when fetching more
                            Array.from({ length: 6 }).map((_, i) => <CreatorCardSkeleton key={`skeleton-${i}`} />)
                        )}
                    </>
                )}
            </div>

            {/* "Show More" Bio Modal Popup */}
            {selectedBio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-background border border-border/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedBio(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground font-mono text-sm border border-border/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-secondary transition-all"
                        >
                            ✕
                        </button>
                        <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                            About {selectedBio.name}
                        </h3>
                        <div className="max-h-[300px] overflow-y-auto text-sm text-foreground/80 leading-relaxed pr-2 font-mono scrollbar-thin">
                            {selectedBio.bio}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={() => setSelectedBio(null)}
                                className="px-6 h-10 text-xs font-mono tracking-wider"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {!showStickyCollapse && (
                <div className="mt-10 flex justify-center">
                    {collapseButton}
                </div>
            )}
            {showStickyCollapse && createPortal(
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
                    {collapseButton}
                </div>,
                document.body
            )}
        </section>
    );
}
