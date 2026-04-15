import Button from "@/components/Atoms/Button";
import FilterList from "@/components/Atoms/FilterList";
import FilterRow from "@/components/Atoms/FilterRow";
import Input from "@/components/Atoms/Input";
import { AppLanguage, ProfilePreference, TimePeriod } from "./types";
import { useTranslations } from "next-intl";

const timeOptions = [
    { id: "month", label: "Month" },
    { id: "halfyear", label: "Half year" },
    { id: "year", label: "Year" },
    { id: "alltime", label: "All time" },
];

type SettingsViewProps = {
    userName: string;
    draftUserName: string;
    preference: ProfilePreference;
    onPreferenceChange: (pref: ProfilePreference) => void;
    onUserNameChange: (value: string) => void;
    onChangePassword: () => void;
    onSignOut: () => void;
    selectedLanguage: AppLanguage;
    onLanguageChange: (lang: AppLanguage) => void;
};

export default function SettingsView({
    userName,
    draftUserName,
    preference,
    onPreferenceChange,
    onUserNameChange,
    onChangePassword,
    onSignOut,
    selectedLanguage,
    onLanguageChange,
}: SettingsViewProps) {
    const t = useTranslations("settings");
    return (
        <div className='w-full h-full flex flex-col px-4 pt-16 pb-32'>
            <div className='mb-6'>
                <Input
                    placeholder={t("nameLabel")}
                    defaultValue={draftUserName}
                    onChange={(e) => onUserNameChange(e.target.value)}
                />
            </div>

            {/* Description */}
            <p className='text-white/50 text-sm mb-4'>
                {t("description")}
            </p>

            {/* Profile display options */}
            <FilterList>
                <FilterRow
                    label={t("gamesLabel")}
                    isSelected={preference.type === "games"}
                    options={timeOptions}
                    selectedOptionId={
                        preference.type === "games"
                            ? preference.timePeriod
                            : undefined
                    }
                    onClick={() => {
                        if (preference.type !== "games") {
                            onPreferenceChange({
                                type: "games",
                                timePeriod: "alltime",
                            });
                        }
                    }}
                    onOptionSelect={(optionId) => {
                        onPreferenceChange({
                            type: "games",
                            timePeriod: (optionId as TimePeriod) || "alltime",
                        });
                    }}
                    showDivider={false}
                />
                <FilterRow
                    label={t("hoursLabel")}
                    isSelected={preference.type === "hours"}
                    options={timeOptions}
                    selectedOptionId={
                        preference.type === "hours"
                            ? preference.timePeriod
                            : undefined
                    }
                    onClick={() => {
                        if (preference.type !== "hours") {
                            onPreferenceChange({
                                type: "hours",
                                timePeriod: "alltime",
                            });
                        }
                    }}
                    onOptionSelect={(optionId) => {
                        onPreferenceChange({
                            type: "hours",
                            timePeriod: (optionId as TimePeriod) || "alltime",
                        });
                    }}
                    showDivider={false}
                />
                <FilterRow
                    label={t("nothingLabel")}
                    isSelected={preference.type === "nothing"}
                    onClick={() => onPreferenceChange({ type: "nothing" })}
                    showDivider={false}
                />
            </FilterList>

            {/* Language picker */}
            <div>
                <FilterList>
                    <p className='text-white/50 text-sm mt-6 mb-4'>
                        {t("languageDescription")}
                    </p>
                    <FilterRow
                        label={t("languageRussian")}
                        isSelected={selectedLanguage === "ru"}
                        onClick={() => onLanguageChange("ru")}
                    />
                    <FilterRow
                        label={t("languageEnglish")}
                        isSelected={selectedLanguage === "en"}
                        onClick={() => onLanguageChange("en")}
                        showDivider={false}
                    />
                </FilterList>
            </div>

            {/* Bottom buttons */}
            <div className='mt-auto flex flex-col gap-3 pt-16'>
                <Button
                    text={t("changePassword")}
                    variant='primary'
                    onClick={onChangePassword}
                    className='w-full'
                />
                <Button
                    text={t("signOut")}
                    variant='secondary'
                    onClick={onSignOut}
                    className='w-full'
                />
            </div>
        </div>
    );
}
