"use client"

import { useState } from "react"
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
import { PasswordInput } from "@/components/ui/password-input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Stepper,
    StepperContent,
    StepperItem,
    StepperNav,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
    StepperPanel
} from "@/components/reui/stepper"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export default function LoginPage() {
    const [activeStep, setActiveStep] = useState(1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange"
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted:", values)
    }

    const nextStep = async () => {
        let isValid = false;
        if (activeStep === 1) {
            isValid = await form.trigger("email");
        }

        if (isValid) {
            setActiveStep((prev) => Math.min(prev + 1, 2));
        }
    };

    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                    <CardTitle className="text-2xl font-serif">Login</CardTitle>
                    <CardDescription className="font-sans">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Stepper
                        value={activeStep}
                        onValueChange={setActiveStep}
                        orientation="vertical"
                        className="flex flex-col items-center justify-center gap-10"
                        indicators={{
                            completed: (
                                <CheckIcon className="size-3.5" />
                            ),
                            loading: (
                                <LoaderCircleIcon className="size-3.5 animate-spin" />
                            ),
                        }}
                    >


                        <StepperPanel className="flex">
                            <StepperNav className="justify-center items-center mt-5 gap-2 me-3">
                                <StepperItem step={1} completed={activeStep > 1}>
                                    <StepperTrigger onClick={() => { if (activeStep > 1) setActiveStep(1) }}>
                                        <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-white">
                                            1
                                        </StepperIndicator>
                                    </StepperTrigger>
                                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                                </StepperItem>

                                <StepperItem step={2}>
                                    <StepperTrigger className="cursor-default">
                                        <StepperIndicator className="data-[state=completed]:bg-primary data-[state=completed]:text-white">
                                            2
                                        </StepperIndicator>
                                    </StepperTrigger>
                                </StepperItem>
                            </StepperNav>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-h-[150px] flex flex-col justify-between w-full">
                                    <StepperContent value={1} className="space-y-4 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-right-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="m@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </StepperContent>

                                    <StepperContent value={2} className="space-y-4 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-right-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Password</FormLabel>
                                                        <Link
                                                            href="/forgot-password"
                                                            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                                                        >
                                                            Forgot your password?
                                                        </Link>
                                                    </div>
                                                    <FormControl>
                                                        <PasswordInput {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </StepperContent>

                                    <div className="flex justify-between pt-8">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            disabled={activeStep === 1}
                                            className={activeStep === 1 ? "opacity-0" : ""}
                                        >
                                            Back
                                        </Button>

                                        {activeStep < 2 ? (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                            >
                                                Next
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                            >
                                                Login
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </StepperPanel>
                    </Stepper>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            {/* Separator */}
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" type="button">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Login with Google
                    </Button>

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
