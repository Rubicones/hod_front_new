 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredLanguage } from "@/components/Tabs";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const lang = getStoredLanguage();
    router.replace(`/${lang}`);
  }, [router]);

  return null;
}
