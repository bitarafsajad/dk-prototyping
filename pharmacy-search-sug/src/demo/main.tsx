import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { SearchPage } from "../search/SearchPage";
import "./demo.css";

/**
 * Demo harness only. Changing `key` unmounts/remounts the page — the same
 * thing a router does when the user genuinely navigates back into search.
 */
function Demo() {
  const [visit, setVisit] = useState(0);
  const refresh = () => setVisit((v) => v + 1);

  return (
    <div className="stage">
      <div className="device">
        <div className="device__screen">
          <SearchPage key={visit} onBack={refresh} />
        </div>
        <div className="device__footer">
          <button type="button" className="replay" onClick={refresh}>
            Refresh page
          </button>
        </div>
      </div>
      <p className="hint">Type to hide the suggestions, clear the field to bring them back.</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
