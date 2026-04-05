"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import type { MonsterSummary } from "@/lib/dnd5eApi";

/** Only transition: filtered list cross-fade on search */
const RESULT_CROSS_MS = 200;

const SHELL_COMPACT = "max-h-[min(240px,42dvh)]";
const SHELL_FULL = "max-h-[min(540px,78dvh)]";

/** 5 rows at h-9 (36px) + gap-2 between rows */
const LIST_H = "h-[calc(5*2.25rem+4*0.5rem)]";

type Props = {
    findMonsterLabel: string;
    searchPlaceholder: string;
    loadingLabel: string;
    loadError: string | null;
    retryLabel: string;
    noMatchesLabel: string;
    closeLabel: string;
    catalog: MonsterSummary[];
    catalogLoading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    onRetryCatalog: () => void;
    onAddByIndex: (index: string) => void;
    addingIndex: string | null;
    onOpenChange: (open: boolean) => void;
    /** `tertiary_small` styling (less padding than `secondary`) while staying full width */
    compactTrigger?: boolean;
};

export default function MonsterFinderPanel({
    findMonsterLabel,
    searchPlaceholder,
    loadingLabel,
    loadError,
    retryLabel,
    noMatchesLabel,
    closeLabel,
    catalog,
    catalogLoading,
    search,
    onSearchChange,
    onRetryCatalog,
    onAddByIndex,
    addingIndex,
    onOpenChange,
    compactTrigger = false,
}: Props) {
    const [open, setOpen] = useState(false);

    const [resultsShownQuery, setResultsShownQuery] = useState(search);
    const [resultsOpacity, setResultsOpacity] = useState(1);
    const searchRef = useRef(search);

    useEffect(() => {
        searchRef.current = search;
    }, [search]);

    const openPanel = useCallback(() => {
        setOpen(true);
        onOpenChange(true);
    }, [onOpenChange]);

    const closePanel = useCallback(() => {
        setOpen(false);
        setResultsShownQuery("");
        setResultsOpacity(1);
        onOpenChange(false);
    }, [onOpenChange]);

    const showListBlock =
        open &&
        !catalogLoading &&
        !loadError &&
        catalog.length > 0;

    useEffect(() => {
        if (!showListBlock) return;
        if (search === resultsShownQuery) return;
        const id = requestAnimationFrame(() => setResultsOpacity(0));
        return () => cancelAnimationFrame(id);
    }, [showListBlock, search, resultsShownQuery]);

    const onResultsTransitionEnd = useCallback(
        (e: React.TransitionEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName !== "opacity") return;
            if (resultsOpacity !== 0) return;
            setResultsShownQuery(searchRef.current);
            requestAnimationFrame(() => setResultsOpacity(1));
        },
        [resultsOpacity],
    );

    const displayedMonsters = useMemo(() => {
        const q = resultsShownQuery.trim().toLowerCase();
        if (!q) return catalog;
        return catalog.filter((m) => m.name.toLowerCase().includes(q));
    }, [catalog, resultsShownQuery]);

    const shellMaxClass = showListBlock ? SHELL_FULL : SHELL_COMPACT;

    return (
        <div className="w-full">
            {!open ? (
                <Button
                    text={findMonsterLabel}
                    variant={compactTrigger ? "tertiary_small" : "secondary"}
                    onClick={openPanel}
                    className="w-full rounded-xl"
                />
            ) : (
                <div
                    className={`w-full overflow-hidden rounded-2xl bg-time-stop p-4 contain-layout ${shellMaxClass}`}
                >
                    <div className="flex min-h-0 flex-col gap-3">
                        <Input
                            key="monster-search-input"
                            placeholder={searchPlaceholder}
                            defaultValue={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            inputMode="search"
                            className="w-full shrink-0"
                        />
                        {catalogLoading && (
                            <p className="text-body shrink-0 px-1 text-gentle-repose">
                                {loadingLabel}
                            </p>
                        )}
                        {loadError && (
                            <div className="flex shrink-0 flex-col gap-2">
                                <p className="text-body px-1 text-fire-storm">
                                    {loadError}
                                </p>
                                <Button
                                    text={retryLabel}
                                    variant="tertiary_small"
                                    onClick={onRetryCatalog}
                                    className="self-start"
                                />
                            </div>
                        )}
                        {showListBlock && (
                                <div
                                    className="min-h-0 w-full shrink-0"
                                    style={{
                                        opacity: resultsOpacity,
                                        transition: `opacity ${RESULT_CROSS_MS}ms ease-out`,
                                    }}
                                    onTransitionEnd={onResultsTransitionEnd}
                                >
                                    <div
                                        className={`flex w-full min-h-0 flex-col gap-2 overflow-y-auto no-scrollbar ${LIST_H}`}
                                    >
                                        {displayedMonsters.length === 0 ? (
                                            <p className="text-body px-1 py-2 text-gentle-repose ">
                                                {noMatchesLabel}
                                            </p>
                                        ) : (
                                            displayedMonsters.map((m) => (
                                                <div
                                                    key={m.index}
                                                    className="flex h-8 w-full"
                                                >
                                                    <div className="flex min-h-0 min-w-0 flex-1 items-center bg-dark-star px-3 text-gentle-repose rounded-full">
                                                        <p className="min-w-0 text-body font-medium truncate">
                                                            {m.name}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            addingIndex ===
                                                            m.index
                                                        }
                                                        className="bg-gentle-repose text-circle-of-power px-5 text-2xl rounded-full cursor-pointer"
                                                        onClick={() =>
                                                            onAddByIndex(m.index)
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        <Button
                            text={closeLabel}
                            variant="tertiary_small"
                            onClick={closePanel}
                            className="w-full shrink-0"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
