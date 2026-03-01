"use client"

import ArtworkForm from "@/components/artwork/ArtworkForm"
import { useUserStore } from "@/store/useUserStore"
import { useEffect, useState } from "react"

export default function CreateArtworkPage() {
    const { user } = useUserStore()
    const [artistProfileId, setArtistProfileId] = useState<number>(1)

    useEffect(() => {
        // TODO: Get artist_profile_id from user profile or context
        // For now, using a default value
        // You should replace this with actual logic to get the artist profile ID
        if (user?.id) {
            // Assuming user has an artist_profile_id field
            // setArtistProfileId(user.artist_profile_id)
        }
    }, [user])

    const handleSubmit = async (values: any) => {
        console.log("Submitting artwork:", values)
        // TODO: Implement API call to create artwork
        // Example:
        // try {
        //     const response = await fetch('/api/artworks', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(values),
        //     })
        //     if (response.ok) {
        //         // Handle success (redirect, show toast, etc.)
        //     }
        // } catch (error) {
        //     // Handle error
        // }
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="flex items-center justify-center p-4">
                <ArtworkForm artistProfileId={artistProfileId} onSubmit={handleSubmit} />
            </div>
        </div>
    )
}