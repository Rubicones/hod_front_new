"use client";

import Input from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import TopToolbar from "@/components/Atoms/TopToolbar";
import Image from "next/image";
import { useState, useEffect, startTransition, ViewTransition } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import loginBg from "../../images/loginBg.webp";
import DesktopPlaceholder from "@/components/Atoms/DesktopPlaceholder";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import { useTranslations } from "next-intl";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const t = useTranslations("auth");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session && !session.error) {
      router.replace("/");
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setError("");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error,
        );
      } else if (result?.ok) {
        router.push("/");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && !session?.error)) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DesktopPlaceholder />

      <Image
        src={loginBg}
        alt=""
        fill
        className="object-cover pointer-events-none fixed inset-0 -z-10"
        priority
      />

      <TopToolbar />

      <div className="w-full h-svh flex justify-center p-3 pt-16">
        <div className="relative w-full max-w-[400px] h-full flex flex-col items-center justify-center">
          <div className="w-full flex flex-col my-auto items-center justify-center gap-2">
            <ViewTransition name="auth-title">
              <span className="text-2xl py-3">{t("login")}</span>
            </ViewTransition>

            <ViewTransition name="auth-email-input">
              <Input
                type="email"
                name="email"
                placeholder={t("email")}
                onChange={handleInputChange}
              />
            </ViewTransition>
            <ViewTransition name="auth-password-input">
              <Input
                type="password"
                name="password"
                placeholder={t("password")}
                onChange={handleInputChange}
              />
            </ViewTransition>
            <ViewTransition name="auth-primary-button">
              <Button
                text={isLoading ? t("loggingIn") : t("login")}
                variant="primary"
                isDisabled={
                  isLoading ||
                  loginForm.email.length === 0 ||
                  loginForm.password.length === 0
                }
                onClick={handleLogin}
                className="w-full mt-1"
              />
            </ViewTransition>
            {error && (
              <span className="mt-3 text-xl mx-8 text-center text-red-400">
                {error}
              </span>
            )}
          </div>
          <ViewTransition name="auth-secondary-button">
            <Button
              text={t("signUpCta")}
              variant="tertiary_small"
              className="w-full mx-3"
              onClick={() => {
                startTransition(() => {
                  router.push("/signup");
                });
              }}
            />
          </ViewTransition>
        </div>
      </div>
    </>
  );
}

