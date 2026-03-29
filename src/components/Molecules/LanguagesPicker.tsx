import { useState, useRef, KeyboardEvent } from "react";
import classNames from "classnames";
import LanguageTag from "../Atoms/LanguageTag";

type Props = {
    /** Title of the section */
    title?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** List of selected languages */
    languages: string[];
    /** Whether the picker is editable */
    isEditable?: boolean;
    /** Callback when languages change */
    onLanguagesChange?: (languages: string[]) => void;
};

const LanguagesPicker = ({
    title = "Languages",
    placeholder = "Enter...",
    languages,
    isEditable = true,
    onLanguagesChange,
}: Props) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Active state is derived from focus or having languages/input value
    const isActive = isFocused || languages.length > 0 || inputValue.length > 0;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const trimmedValue = inputValue.trim();
            if (trimmedValue && !languages.includes(trimmedValue)) {
                onLanguagesChange?.([...languages, trimmedValue]);
                setInputValue("");
            }
        } else if (e.key === "Backspace" && inputValue === "" && languages.length > 0) {
            // Remove last language and put it in the input for editing
            const lastLanguage = languages[languages.length - 1];
            onLanguagesChange?.(languages.slice(0, -1));
            setInputValue(lastLanguage);
        }
    };

    const handleDelete = (languageToDelete: string) => {
        onLanguagesChange?.(languages.filter((lang) => lang !== languageToDelete));
    };

    const handleContainerClick = () => {
        if (isEditable && inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={classNames("w-full rounded-3xl p-4", isEditable ? "bg-teleport border border-find-the-path" : "bg-dark-star")}>
            {/* Title */}
            <h3 className="text-divine-favor mb-3 font-medium text-body">{title}</h3>

            {/* Languages row with input */}
            <div
                className={classNames(
                    "flex flex-wrap items-center gap-2",
                    isEditable && "cursor-text"
                )}
                onClick={handleContainerClick}
            >
                {/* Language tags */}
                {languages.map((language) => (
                    <LanguageTag
                        key={language}
                        text={language}
                        isEditable={isEditable}
                        onDelete={() => handleDelete(language)}
                    />
                ))}

                {/* Input field - only when editable */}
                {isEditable && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className={classNames(
                            "bg-transparent text-beacon-of-hope outline-none text-body min-w-[80px] flex-1",
                            isActive
                                ? "placeholder:text-beacon-of-hope"
                                : "placeholder:text-divine-favor"
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default LanguagesPicker;

