import { useState } from "react";
import { SuggestionChips, type Suggestion } from "./SuggestionChips";
import searchIcon from "./assets/search.svg";
import arrowBackIcon from "./assets/arrow-back.svg";
import "./search.css";

// Listed in RTL reading order (right → left, row by row) so the wrap
// reproduces the Figma rows exactly. Content is from the design, including
// its repeated "قرص استامینوفن" chip.
const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: "cold", label: "قرص سرما‌خوردگی" },
  { id: "antihistamine", label: "قرص آنتی‌هیستامین" },
  { id: "acetaminophen-1", label: "قرص استامینوفن" },
  { id: "acetaminophen-2", label: "قرص استامینوفن" },
  { id: "vitamin-c", label: "ویتامین ث" },
  { id: "gelofen", label: "ژلوفن" },
  { id: "b-complex", label: "ب کمپلکس" },
  { id: "zinc-plus", label: "زینک پلاس" },
];

type Props = {
  suggestions?: Suggestion[];
  onBack?: () => void;
};

export function SearchPage({ suggestions = DEFAULT_SUGGESTIONS, onBack }: Props) {
  const [query, setQuery] = useState("");
  const isEmpty = query.trim().length === 0;

  return (
    <div className="search-page" dir="rtl">
      <header className="search-header">
        <div className="search-header__row">
          <button type="button" className="search-icon-button" aria-label="بازگشت" onClick={onBack}>
            <img src={arrowBackIcon} alt="" width={24} height={24} />
          </button>

          <label className="search-field">
            <img className="search-field__icon" src={searchIcon} alt="" width={24} height={24} />
            <input
              className="search-field__input"
              type="search"
              placeholder="جستجو بدون نسخه"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="جستجو بدون نسخه"
            />
          </label>
        </div>
      </header>

      <main className="search-content">
        {/* Mounted only for the empty state, so each fresh empty state
            (page entry, or clearing the field) gets a new random pop. */}
        {isEmpty && <SuggestionChips suggestions={suggestions} onSelect={(s) => setQuery(s.label)} />}
      </main>
    </div>
  );
}
