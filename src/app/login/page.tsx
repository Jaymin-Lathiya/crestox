"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import GradientButton from "@/components/ui/gradiant-button"
import { useAuthStore } from "@/store/useAuthStore"
import { CheckCircle2 } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export default function LoginPage() {
    const { requestMagicLink, isLoading, isSuccess, error } = useAuthStore()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
        mode: "onChange"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.email || values.email.trim() === "") {
            form.setError("email", { type: "manual", message: "Email is required" });
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(values.email)) {
            form.setError("email", { type: "manual", message: "Please enter a valid email address." });
            return;
        }

        await requestMagicLink(values.email)
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-2xl font-serif">Login</CardTitle>
                    <CardDescription className="font-sans">
                        {isSuccess
                            ? "Check your email for the magic link."
                            : "Enter your email below to login to your account"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <CheckCircle2 className="h-16 w-16 text-primary" />
                            <p className="text-center text-muted-foreground">
                                We've sent a secure login link to <strong>{form.getValues("email")}</strong>.
                                Please check your inbox.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="m@example.com" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && (
                                        <div className="text-sm font-medium text-destructive mt-2">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <GradientButton
                                            type="submit"
                                            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                            label={isLoading ? "Sending..." : "Continue with Email"}
                                            onClick={() => {
                                                onSubmit(form.getValues())
                                            }}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </form>
                            </Form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Login with Google
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter className="justify-center pb-6 border-t pt-6 bg-muted/20">
                    <div className="text-sm text-muted-foreground font-sans">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

