"use client";

import { useTranslations } from "next-intl";

export type RoomEntry = {
    id: string;
    name: string;
};

type Props = {
    rooms: RoomEntry[];
    onEnterRoom: (roomId: string) => void;
};

/** Same row pattern as monster finder: unified pill, action is chevron (enter room). */
export default function RoomEntryList({ rooms, onEnterRoom }: Props) {
    const tGame = useTranslations("game");

    if (rooms.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-2">
            {rooms.map((room) => (
                <div
                    key={room.id}
                    className="flex h-9 w-full min-w-0 overflow-hidden rounded-full"
                >
                    <div className="flex min-w-0 flex-1 items-center bg-dark-star px-3 text-gentle-repose">
                        <p className="min-w-0 text-body font-medium truncate">
                            {room.name}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="flex w-14 shrink-0 cursor-pointer items-center justify-center border-0 bg-gentle-repose text-circle-of-power transition-opacity hover:opacity-90"
                        aria-label={tGame("enterRoom")}
                        onClick={() => onEnterRoom(room.id)}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden
                        >
                            <path
                                d="M9 6L15 12L9 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
