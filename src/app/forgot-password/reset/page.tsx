"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
import { PasswordInput } from "@/components/ui/password-input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Check, X } from "lucide-react"

// Password Policy Regex
const minLength = /.{8,}/
const uppercase = /[A-Z]/
const lowercase = /[a-z]/
const number = /[0-9]/
const specialChar = /[!@#$%*=]/

const formSchema = z.object({
    password: z.string()
        .min(8, "At least 8 characters")
        .regex(uppercase, "One uppercase letter")
        .regex(lowercase, "One lowercase letter")
        .regex(number, "One number")
        .regex(specialChar, "One special character (!@#$%*=)"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    })

    // Watch password field for visual feedback
    const password = form.watch("password")

    // Validation states
    const [val, setVal] = useState({
        length: false,
        upper: false,
        lower: false,
        num: false,
        special: false,
    })

    useEffect(() => {
        setVal({
            length: minLength.test(password || ""),
            upper: uppercase.test(password || ""),
            lower: lowercase.test(password || ""),
            num: number.test(password || ""),
            special: specialChar.test(password || ""),
        })
    }, [password])

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        // Simulate password reset
        router.push("/login")
    }

    const ValidationItem = ({ fulfilled, label }: { fulfilled: boolean; label: string }) => (
        <div className={`flex items-center text-sm ${fulfilled ? "text-emerald-500" : "text-muted-foreground"}`}>
            {fulfilled ? <Check className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4 opacity-0" />}
            {/* Keeping Check icon invisible for alignment when unfulfilled, or could use X but design usually shows ticked when done */}
            {label}
        </div>
    )

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
                    <CardDescription>
                        Create a new password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Visual Password Policy Checklist */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2 p-4 bg-muted/20 rounded-md border border-border/50">
                                <ValidationItem fulfilled={val.length} label="At least 8 characters" />
                                <ValidationItem fulfilled={val.upper} label="One uppercase letter" />
                                <ValidationItem fulfilled={val.lower} label="One lowercase letter" />
                                <ValidationItem fulfilled={val.num} label="One number" />
                                <ValidationItem fulfilled={val.special} label="One special character (!@#$%*=)" />
                            </div>

                            <Button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                                Set Password
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
