"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-serif">Passwordless sign in</CardTitle>
                    <CardDescription>
                        Crestox accounts do not use passwords. Request a secure magic link from the login page instead.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/login">
                            <Mail className="mr-2 h-4 w-4" />
                            Request a sign-in link
                        </Link>
                    </Button>
                </CardContent>
                <CardFooter className="justify-center">
                    <Link
                        href="/login"
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
