 "use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import graphicPattern1 from "@/app/images/graphicPattern1.svg";
import { useTranslations } from "next-intl";

type JoinGameViewProps = {
    onBack: () => void;
    onJoin: (code: string) => void;
    isJoining?: boolean;
    error?: string | null;
    onErrorDismiss?: () => void;
};

export default function JoinGameView({ onBack, onJoin, isJoining = false, error, onErrorDismiss }: JoinGameViewProps) {
    const [code, setCode] = useState("");
    const t = useTranslations("join");

    const handleSubmit = () => {
        const trimmed = code.trim();
        if (trimmed) onJoin(trimmed);
    };

    return (
        <div className="w-full h-screen flex flex-col pt-16 pb-8 overflow-hidden relative bg-black">
            {/* Pattern only - exactly like signup final step (no colorful bg image) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 grid grid-rows-4">
                    <div className="w-full flex justify-end">
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover translate-x-[70%]"
                        />
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover translate-x-[70%]"
                        />
                    </div>
                    <div className="w-full flex justify-start">
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover -translate-x-[70%]"
                        />
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover -translate-x-[70%]"
                        />
                    </div>
                    <div className="w-full flex justify-end">
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover translate-x-[70%]"
                        />
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover translate-x-[70%]"
                        />
                    </div>
                    <div className="w-full flex justify-start">
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover -translate-x-[70%]"
                        />
                        <Image
                            src={graphicPattern1}
                            alt=""
                            className="h-full grayscale brightness-10 object-cover -translate-x-[70%]"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1 px-4 max-w-[400px] w-full mx-auto justify-center">
                <p className="text-center text-white/90 text-body mb-6">
                    {t("description")}
                </p>

                <div className="w-full mb-6">
                    <Input
                        placeholder={t("placeholder")}
                        onChange={(e) => {
                            setCode(e.target.value);
                            onErrorDismiss?.();
                        }}
                    />
                </div>

                {error && (
                    <p className="text-fire-storm text-body mb-4 text-center">
                        {error}
                    </p>
                )}

                <Button
                    text={isJoining ? t("joining") : t("join")}
                    variant="primary"
                    isDisabled={!code.trim() || isJoining}
                    onClick={handleSubmit}
                    className="w-full"
                />
            </div>
        </div>
    );
}
