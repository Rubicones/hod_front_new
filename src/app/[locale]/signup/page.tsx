"use client";

import Input from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import TopToolbar from "@/components/Atoms/TopToolbar";
import Image from "next/image";
import { useState, useEffect, startTransition, ViewTransition } from "react";
import { addTransitionType } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import graphicPattern1 from "../../images/graphicPattern1.svg";
import loginBg from "../../images/loginBg.webp";
import authenticatedBg from "../../images/authenticatedBg.webp";
import DesktopPlaceholder from "@/components/Atoms/DesktopPlaceholder";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import { useLocale, useTranslations } from "next-intl";

export default function SignUp() {
    const router = useRouter();
    const locale = useLocale();
    const { data: session, status } = useSession();
    const t = useTranslations("auth");
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session && !session.error) {
            router.replace(`/${locale}`);
        }
    }, [status, session, router, locale]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirm) {
            setError(t("passwordsMismatch"));
            return;
        }

        if (formData.password.length < 8) {
            setError(t("passwordTooShort"));
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t("registrationFailed"));
            }

            setStep(3);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : t("registrationFailed"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToStep = (newStep: number) => {
        const direction = newStep > step ? "nav-forward" : "nav-backward";
        startTransition(() => {
            addTransitionType(direction);
            setStep(newStep);
        });
    };

    const handleContinue = () => {
        if (step === 2) {
            handleRegister();
        } else {
            navigateToStep(step + 1);
        }
    };

    const handleBack = () => {
        navigateToStep(step - 1);
    };

    if (status === "loading" || (status === "authenticated" && !session?.error)) {
        return <LoadingScreen />;
    }

    // Step 3: Registration complete screen
    if (step === 3) {
        return (
            <>
            <DesktopPlaceholder />
            <div className='w-full h-svh flex justify-center p-3 overflow-hidden relative'>
                {/* Background image */}
                <Image
                    src={authenticatedBg}
                    alt=''
                    fill
                    className='object-cover pointer-events-none'
                    priority
                />
                
                <div className='relative w-full max-w-[400px] h-full flex flex-col items-center justify-center z-10'>
                    {/* Background pattern overlay - tiled grid */}
                    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                        <div className='absolute inset-0 grid grid-rows-4'>
                            <div className='w-full flex justify-end'>
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover translate-x-[70%]'
                                />
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover translate-x-[70%]'
                                />
                            </div>
                            <div className='w-full flex justify-start'>
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover -translate-x-[70%]'
                                />
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover -translate-x-[70%]'
                                />
                            </div>
                            <div className='w-full flex justify-end'>
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover translate-x-[70%]'
                                />
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover translate-x-[70%]'
                                />
                            </div>
                            <div className='w-full flex justify-start'>
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover -translate-x-[70%]'
                                />
                                <Image
                                    src={graphicPattern1}
                                    alt=''
                                    className='h-full grayscale brightness-10 object-cover -translate-x-[70%]'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='relative z-10 flex flex-col items-center text-center px-4'>
                        <h1 className='text-2xl font-bold text-white mb-3'>
                            {t("registrationCompleteTitle")}
                        </h1>
                        <p className='text-lg text-white/80'>
                            {t("registrationCompleteBody")}
                        </p>
                    </div>

                    {/* Bottom button */}
                    <div className='absolute bottom-3 left-0 right-0 px-3 z-10'>
                        <Button
                            text={t("login")}
                            variant='primary'
                            onClick={() => {
                                router.push(`/${locale}/login`);
                            }}
                            className='w-full'
                        />
                    </div>
                </div>
            </div>
            </>
        );
    }

    return (
        <>
            <DesktopPlaceholder />

            {/* Background image */}
            <Image
                src={loginBg}
                alt=''
                fill
                className='object-cover pointer-events-none fixed inset-0 -z-10'
                priority
            />
            
            <TopToolbar
                showChevron={step !== 0}
                onChevronClick={handleBack}
            />
            <div className='w-full h-svh flex justify-center p-3 pt-16'>
                <div className='relative w-full max-w-[500px] h-full flex flex-col items-center justify-center overflow-hidden'>
                    <div className='w-full flex flex-col my-auto items-center justify-center gap-2'>
                        <ViewTransition name={step === 0 ? 'auth-title' : undefined}>
                            <span className='text-2xl py-3'>{t("signupTitle")}</span>
                        </ViewTransition>
                        
                        {step === 0 && (
                            <ViewTransition
                                name='auth-email-input'
                                enter={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                                exit={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                            >
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder={t("email")}
                                    defaultValue={formData.email}
                                    onChange={handleInputChange}
                                />
                            </ViewTransition>
                        )}
                        
                        {step === 1 && (
                            <ViewTransition
                                enter={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                                exit={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                            >
                                <div className='w-full flex flex-col items-center'>
                                    <Input
                                        name='password'
                                        placeholder={t("password")}
                                        type='password'
                                        defaultValue={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <span className='mt-3 text-xl mx-8 text-center'>
                                        {t("passwordHint")}
                                    </span>
                                </div>
                            </ViewTransition>
                        )}
                        
                        {step === 2 && (
                            <ViewTransition
                                enter={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                                exit={{
                                    "nav-forward": "slide-forward",
                                    "nav-backward": "slide-backward",
                                    "default": "auto"
                                }}
                            >
                                <div className='w-full flex flex-col items-center gap-2'>
                                    <Input
                                        name='password'
                                        placeholder={t("password")}
                                        type='password'
                                        defaultValue={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        type='password'
                                        name='confirm'
                                        placeholder={t("confirmPassword")}
                                        defaultValue={formData.confirm}
                                        onChange={handleInputChange}
                                    />
                                    <span className='mt-3 text-xl mx-8 text-center'>
                                        {t("confirmPasswordHint")}
                                    </span>
                                </div>
                            </ViewTransition>
                        )}
                        
                        {error && (
                            <span className='mt-3 text-xl mx-8 text-center text-red-400'>
                                {error}
                            </span>
                        )}
                        
                        <ViewTransition name={step === 0 ? 'auth-primary-button' : undefined}>
                            <Button
                                text={
                                    isLoading ? t("creatingAccount") : t("continue")
                                }
                                variant='primary'
                                isDisabled={
                                    isLoading ||
                                    (step === 0 && formData.email.length === 0) ||
                                    ((step === 1 || step === 2) &&
                                        formData.password.length === 0) ||
                                    (step === 2 && formData.confirm.length === 0)
                                }
                                onClick={handleContinue}
                                className='w-full mt-1'
                            />
                        </ViewTransition>
                    </div>
                    <ViewTransition name={step === 0 ? 'auth-secondary-button' : undefined}>
                        <Button
                            text={t("login")}
                            variant='tertiary_small'
                            onClick={() => {
                                startTransition(() => {
                                    router.push(`/${locale}/login`);
                                });
                            }}
                            className='w-full mx-3'
                        />
                    </ViewTransition>
                </div>
            </div>
        </>
    );
}