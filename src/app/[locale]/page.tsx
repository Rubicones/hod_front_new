"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, startTransition, ViewTransition } from "react";
import { addTransitionType } from "react";
import Image from "next/image";
import BottomToolbar from "@/components/Atoms/BottomToolbar";
import LoadingScreen from "@/components/Atoms/LoadingScreen";
import TopToolbar from "@/components/Atoms/TopToolbar";
import DesktopPlaceholder from "@/components/Atoms/DesktopPlaceholder";
import {
  HomeTab,
  ConditionsList,
  ConditionDetail,
  ProfileTab,
  SettingsView,
  CharacterCreation,
  JoinGameView,
  type Character,
  TabType,
  TAB_INDEX,
  ProfilePreference,
  getStoredPreference,
  savePreference,
  type AppLanguage,
  saveLanguage,
} from "@/components/Tabs";
import { Condition } from "@/data/conditions";
import { api } from "@/lib/api";
import { getLastGameId, setGameIdForCode, setLastGameId } from "@/lib/gameStorage";
import { setUserId } from "@/lib/userStorage";
import authenticatedBg from "../images/authenticatedBg.webp";
import classNames from "classnames";
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const tHome = useTranslations("home");
  const tErrors = useTranslations("errors");
  const tGame = useTranslations("game");
  const tSettings = useTranslations("settings");
  const tEffects = useTranslations("effects");
  const tNav = useTranslations("nav");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCondition, setSelectedCondition] =
    useState<Condition | null>(null);
  const [profilePreference, setProfilePreference] =
    useState<ProfilePreference>(() => getStoredPreference());
  const [draftPreference, setDraftPreference] =
    useState<ProfilePreference | null>(null);
  const [draftLanguage, setDraftLanguage] = useState<AppLanguage>(
    (locale as AppLanguage) ?? "en",
  );
  const [games, setGames] = useState<unknown[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [draftUserName, setDraftUserName] = useState<string>("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [currentGameCode, setCurrentGameCode] = useState<string | null>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const [showJoinGame, setShowJoinGame] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}/login`);
    }
    if (session?.error === "RefreshTokenError") {
      signOut({ callbackUrl: `/${locale}/login` });
    }
  }, [status, session?.error, router, locale]);

  useEffect(() => {
    const fetchGames = async () => {
      if (status === "authenticated" && session?.accessToken) {
        setGamesLoading(true);
        setGamesError(null);
        try {
          const data = await api.get<unknown[]>("/game/all", session.accessToken);
          setGames(data);
          console.log("Games fetched:", data);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : tErrors("failedToFetchGames");
          setGamesError(message);
          console.error("Failed to fetch games:", err);
        } finally {
          setGamesLoading(false);
        }
      }
    };

    fetchGames();
  }, [status, session?.accessToken, tErrors]);

  useEffect(() => {
    if (!session) return;
    const fallbackName =
      session.user?.name ||
      session.user?.email?.split("@")[0] ||
      tHome("friendFallback");
    setUserName(fallbackName);
  }, [session, tHome]);

  useEffect(() => {
    const fetchMe = async () => {
      if (status !== "authenticated" || !session?.accessToken) return;
      try {
        const me = await api.get<{ id?: string; name?: string }>(
          "/user/me",
          session.accessToken,
        );
        if (me?.id) {
          setUserId(me.id);
        }
        if (me?.name?.trim()) {
          setUserName(me.name.trim());
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchMe();
  }, [status, session?.accessToken]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
  }

  const navigateToTab = (newTab: TabType) => {
    const currentIndex = TAB_INDEX[activeTab];
    const newIndex = TAB_INDEX[newTab];
    const direction = newIndex > currentIndex ? "nav-forward" : "nav-backward";

    startTransition(() => {
      addTransitionType(direction);
      setActiveTab(newTab);
      if (newTab !== "menu") {
        setSelectedCondition(null);
      }
    });
  };

  const handleMenuClick = () => navigateToTab("menu");
  const handleHomeClick = () => navigateToTab("home");
  const handleProfileClick = () => navigateToTab("profile");

  const handleCreateGame = async () => {
    if (!session?.accessToken || isCreatingGame) return;

    setIsCreatingGame(true);
    try {
      const response = await api.post<{ game_id: string; code: string }>(
        "/game/create",
        {},
        session.accessToken,
      );

      setGameIdForCode(response.code, response.game_id);
      setLastGameId(response.code);
      router.push(`/${locale}/game/${response.code}`);
    } catch (err) {
      console.error("Failed to create game:", err);
      alert(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = () => {
    startTransition(() => {
      addTransitionType("nav-forward");
      setShowJoinGame(true);
    });
  };

  const handleBackFromJoinGame = () => {
    startTransition(() => {
      addTransitionType("nav-backward");
      setShowJoinGame(false);
    });
  };

  const handleJoinWithCode = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || !session?.accessToken) return;

    setIsJoiningGame(true);
    setJoinError(null);
    try {
      const joined = await api.post<{
        game_id?: string;
        code?: string;
        role?: string;
        character_id?: string;
      }>(
        "/game/join",
        { code: trimmed },
        session?.accessToken,
      );
      const resolvedCode = joined?.code?.trim() || trimmed;
      if (joined?.game_id) {
        setGameIdForCode(resolvedCode, joined.game_id);
      }
      setLastGameId(resolvedCode);
      router.push(`/${locale}/game/${resolvedCode}`);
    } catch (err) {
      setJoinError(
        err instanceof Error
          ? err.message || tErrors("sessionNotFoundDetailed")
          : tErrors("failedToJoin"),
      );
    } finally {
      setIsJoiningGame(false);
    }
  };

  const handleBackFromCharacterCreation = () => {
    startTransition(() => {
      addTransitionType("nav-backward");
      setShowCharacterCreation(false);
      setCurrentGameId(null);
      setCurrentGameCode(null);
    });
  };

  const handleStartGame = async (characters: Character[]) => {
    if (!currentGameId || !session?.accessToken) return;

    const toCreate = characters.filter(
      (c) => c.characterName.trim() !== "",
    );
    if (toCreate.length === 0) return;

    setIsStartingGame(true);
    try {
      for (const c of toCreate) {
        const created = await api.post<{ id: string }>(
          "/character/create",
          {
            name: c.characterName.trim(),
            initiative: 0,
            armor: c.armor ?? 0,
            hp: c.hp ?? 0,
            is_monster: c.isMonster ?? false,
            languages: c.languages ?? [],
            passive_perception: 10,
            passive_investigation: 10,
            passive_insight: 10,
          },
          session.accessToken,
        );
        await api.post(
          `/game/${currentGameId}/register`,
          { character_id: created.id },
          session.accessToken,
        );
      }

      setLastGameId(currentGameCode ?? currentGameId);
      startTransition(() => {
        addTransitionType("nav-forward");
        setShowCharacterCreation(false);
      });
      router.push(`/${locale}/game/${currentGameCode ?? currentGameId}`);
    } catch (err) {
      console.error("Start game failed:", err);
      alert(
        err instanceof Error ? err.message : "Failed to start game",
      );
    } finally {
      setIsStartingGame(false);
    }
  };

  const handleConditionClick = (condition: Condition) => {
    startTransition(() => {
      addTransitionType("nav-forward");
      setSelectedCondition(condition);
    });
  };

  const handleConditionBack = () => {
    startTransition(() => {
      addTransitionType("nav-backward");
      setSelectedCondition(null);
    });
  };

  const handleOpenSettings = () => {
    startTransition(() => {
      addTransitionType("settings-open");
      setDraftPreference(profilePreference);
      setDraftLanguage((locale as AppLanguage) ?? "en");
      setDraftUserName(userName);
      setShowSettings(true);
    });
  };

  const handleCloseSettings = async (save: boolean) => {
    if (isSavingSettings) return;

    if (save) {
      if (!session?.accessToken) return;

      setIsSavingSettings(true);
      try {
        const trimmedName = draftUserName.trim();
        if (trimmedName && trimmedName !== userName) {
          await api.patch(
            "/user/me/name",
            { name: trimmedName },
            session.accessToken,
          );
          setUserName(trimmedName);
        }

        if (draftPreference) {
          setProfilePreference(draftPreference);
          savePreference(draftPreference);
        }

        saveLanguage(draftLanguage);
        if (draftLanguage !== locale) {
          router.push(`/${draftLanguage}`);
        }
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : tSettings("nameUpdateFailed"),
        );
        return;
      } finally {
        setIsSavingSettings(false);
      }
    }

    startTransition(() => {
      addTransitionType("settings-close");
      setDraftPreference(null);
      setShowSettings(false);
    });
  };

  const handleChangePassword = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL || ""}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM || ""}/account/password`,
      "_blank",
    );
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/signup" });
  };

  void games;
  void gamesLoading;
  void gamesError;

  return (
    <>
      <DesktopPlaceholder />

      {!showCharacterCreation &&
        !showJoinGame &&
        activeTab === "home" && (
          <Image
            src={authenticatedBg}
            alt=""
            fill
            className="object-cover pointer-events-none fixed inset-0 -z-10"
            priority
          />
        )}

      <TopToolbar
        showChevron={
          showCharacterCreation ||
          showJoinGame ||
          (activeTab === "profile" ||
            showSettings ||
            (activeTab === "menu" && selectedCondition !== null))
        }
        showShare={showCharacterCreation}
        onShareClick={() => {
          if (currentGameCode) {
            navigator.clipboard.writeText(currentGameCode);
          }
        }}
        onChevronClick={() => {
          if (showSettings) {
            handleCloseSettings(false);
          } else if (showJoinGame) {
            handleBackFromJoinGame();
          } else if (showCharacterCreation) {
            handleBackFromCharacterCreation();
          } else if (activeTab === "menu" && selectedCondition) {
            handleConditionBack();
          } else {
            navigateToTab("home");
          }
        }}
        subtitle={showCharacterCreation ? tGame("newSession") : undefined}
        title={
          showJoinGame
            ? tNav("gameCode")
            : showCharacterCreation && currentGameCode
              ? tGame("sessionTitle", { code: currentGameCode })
              : showSettings
                ? tNav("settingsTitle")
                : activeTab === "menu" && !selectedCondition
                  ? tEffects("title")
                  : undefined
        }
        showDone={showSettings}
        onDoneClick={() => handleCloseSettings(true)}
      />

      <div
        className={classNames(
          "w-full flex justify-center my-auto md:pb-0",
          showSettings || showCharacterCreation || showJoinGame
            ? "h-full"
            : "h-[calc(100svh-64px)]",
        )}
      >
        <div className="w-full max-w-[500px] h-full overflow-hidden">
          {showCharacterCreation &&
            currentGameId &&
            currentGameCode && (
              <ViewTransition
                enter={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  default: "auto",
                }}
                exit={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  default: "auto",
                }}
              >
                <CharacterCreation
                  onStartGame={handleStartGame}
                  isStartingGame={isStartingGame}
                />
              </ViewTransition>
            )}

          {showJoinGame && (
            <ViewTransition
              enter={{
                "nav-forward": "slide-forward",
                "nav-backward": "slide-backward",
                default: "auto",
              }}
              exit={{
                "nav-forward": "slide-forward",
                "nav-backward": "slide-backward",
                default: "auto",
              }}
            >
              <JoinGameView
                onBack={handleBackFromJoinGame}
                onJoin={handleJoinWithCode}
                isJoining={isJoiningGame}
                error={joinError}
                onErrorDismiss={() => setJoinError(null)}
              />
            </ViewTransition>
          )}

          {!showCharacterCreation && !showJoinGame && showSettings && (
            <ViewTransition
              enter={{
                "settings-open": "fade-transition",
                default: "auto",
              }}
              exit={{
                "settings-close": "fade-transition",
                default: "auto",
              }}
            >
              <SettingsView
                userName={userName}
                draftUserName={draftUserName}
                preference={draftPreference || profilePreference}
                onPreferenceChange={setDraftPreference}
                onUserNameChange={setDraftUserName}
                onChangePassword={handleChangePassword}
                onSignOut={handleSignOut}
                selectedLanguage={draftLanguage}
                onLanguageChange={setDraftLanguage}
              />
            </ViewTransition>
          )}

          {!showCharacterCreation &&
            !showJoinGame &&
            !showSettings &&
            activeTab === "home" && (
              <ViewTransition
                enter={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-close": "fade-transition",
                  default: "auto",
                }}
                exit={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-open": "fade-transition",
                  default: "auto",
                }}
              >
                <HomeTab
                  userName={userName}
                  onCreateGame={handleCreateGame}
                  onJoinGame={handleJoinGame}
                  onRejoinLastSession={() => {
                    const last = getLastGameId();
                    if (last) router.push(`/${locale}/game/${last}`);
                  }}
                  lastGameId={getLastGameId()}
                  isCreatingGame={isCreatingGame}
                />
              </ViewTransition>
            )}

          {!showCharacterCreation &&
            !showJoinGame &&
            !showSettings &&
            activeTab === "menu" &&
            !selectedCondition && (
              <ViewTransition
                enter={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-close": "fade-transition",
                  default: "auto",
                }}
                exit={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-open": "fade-transition",
                  default: "auto",
                }}
              >
                <ConditionsList onConditionClick={handleConditionClick} />
              </ViewTransition>
            )}

          {!showCharacterCreation &&
            !showJoinGame &&
            !showSettings &&
            activeTab === "menu" &&
            selectedCondition && (
              <ViewTransition
                enter={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  default: "auto",
                }}
                exit={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  default: "auto",
                }}
              >
                <ConditionDetail condition={selectedCondition} />
              </ViewTransition>
            )}

          {!showCharacterCreation &&
            !showJoinGame &&
            !showSettings &&
            activeTab === "profile" && (
              <ViewTransition
                enter={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-close": "fade-transition",
                  default: "auto",
                }}
                exit={{
                  "nav-forward": "slide-forward",
                  "nav-backward": "slide-backward",
                  "settings-open": "fade-transition",
                  default: "auto",
                }}
              >
                <ProfileTab
                  userName={userName}
                  email={session.user?.email || undefined}
                  profilePreference={profilePreference}
                  onOpenSettings={handleOpenSettings}
                />
              </ViewTransition>
            )}
        </div>
      </div>

      {!showCharacterCreation &&
        !showJoinGame &&
        !showSettings && (
          <BottomToolbar
            activeTab={activeTab}
            onMenuClick={handleMenuClick}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
          />
        )}
    </>
  );
}

