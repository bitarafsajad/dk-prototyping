import { useEffect, useRef } from "react";
import { createRainScene } from "./rainScene";
import "./TopNavigation.css";

import cloud1 from "./assets/cloud-1.webp";
import cloud2 from "./assets/cloud-2.webp";
import cloud3 from "./assets/cloud-3.webp";
import cloud4 from "./assets/cloud-4.webp";
import cloud5 from "./assets/cloud-5.webp";
import cloud6 from "./assets/cloud-6.webp";

/**
 * Weather backgrounds are data, so the header can switch weather at runtime
 * (e.g. from an API). Everything is drawn live in code — no video.
 *
 *  scene          (canvas, cloudSources, options) => { destroy() }
 *                 drawing engine; swap it for snow, sun, etc. later
 *  clouds         cloud images used by the scene
 *  options        scene options, e.g. { rain: 1, cloudSpeed: 1, seed }
 *  sky            CSS background behind the scene
 *  fade           remove the bottom third (soft fade to transparent)
 *  overlay        CSS background of the tint layer on top (null = none)
 *  overlayOpacity layer opacity (Figma: 48%)
 */
export const WEATHER_BACKGROUNDS = {
  rain: {
    scene: createRainScene,
    clouds: [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6],
    options: { rain: 1, cloudSpeed: 1 },
    sky: "linear-gradient(180deg, #2c4d6e 0%, #3b6189 28%, #6890b4 58%, #91b0c9 82%, #a3bed3 100%)",
    fade: true,
    overlay: "linear-gradient(180deg, rgba(33, 0, 123, 0.9) 0%, rgba(82, 0, 123, 0) 100%)",
    overlayOpacity: 0.48,
  },
};

function ChevronLeftCompact(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.2929 7.29302C12.6834 6.90249 13.3164 6.90249 13.707 7.29302C14.0975 7.68354 14.0975 8.31655 13.707 8.70708L10.414 12L13.707 15.293C14.0975 15.6835 14.0975 16.3166 13.707 16.7071C13.3164 17.0976 12.6834 17.0976 12.2929 16.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6835 8.29289 11.293L12.2929 7.29302Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MagnifyingGlass(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.489 20.29L18.759 17.57C20.219 15.87 21.049 13.68 21.049 11.42C21.049 6.22005 16.819 2.00005 11.629 2.00005C6.43898 2.00005 2.20898 6.22005 2.20898 11.42C2.20898 16.62 6.42898 20.84 11.629 20.84C13.689 20.84 15.669 20.17 17.299 18.94L20.079 21.71C20.279 21.9 20.529 22 20.789 22C21.049 22 21.299 21.9 21.499 21.71C21.889 21.32 21.889 20.69 21.499 20.3L21.489 20.29ZM16.679 16.85C15.299 18.13 13.509 18.83 11.639 18.83C7.54898 18.83 4.21898 15.5 4.21898 11.41C4.21898 7.32005 7.54898 3.99005 11.639 3.99005C15.729 3.99005 19.059 7.32005 19.059 11.41C19.059 13.46 18.199 15.44 16.689 16.84L16.679 16.85ZM16.509 10.35C16.429 10.37 16.359 10.39 16.279 10.39C15.959 10.39 15.669 10.19 15.569 9.87005C15.199 8.71005 14.279 7.81005 13.109 7.46005C12.709 7.34005 12.489 6.92005 12.609 6.52005C12.729 6.12005 13.149 5.90005 13.549 6.02005C15.179 6.52005 16.469 7.78005 16.999 9.41005C17.129 9.80005 16.909 10.23 16.519 10.35H16.509Z"
        fill="#000"
        fillOpacity="0.4"
      />
    </svg>
  );
}

/** Live animated sky: clouds drifting + rain, drawn on a canvas. */
function WeatherSky({ scene, clouds, options, sky, fade }) {
  const canvasRef = useRef(null);
  const optionsKey = JSON.stringify(options || {});

  useEffect(() => {
    if (!scene || !canvasRef.current) return;
    const instance = scene(canvasRef.current, clouds || [], options || {});
    return () => instance?.destroy?.();
    // rebuild when the weather (engine, clouds or options) changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, (clouds || []).join("|"), optionsKey]);

  return (
    <div className={`top-nav__sky${fade ? " top-nav__sky--fade" : ""}`} style={{ background: sky }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

/**
 * TopNavigation
 *
 * Props
 *  background        a WEATHER_BACKGROUNDS entry or your own (see above)
 *  deliveryLabel     "تحویل به"
 *  place             "محل‌کار"
 *  address           "ونک، هتل هما، ۴۰ دقیقه"
 *  onLocationClick() opens the address picker
 *  searchPlaceholder "جستجوی کالا"
 *  onSearchClick()   opens search
 */
export default function TopNavigation({
  background = WEATHER_BACKGROUNDS.rain,
  deliveryLabel = "تحویل به",
  place = "محل‌کار",
  address = "ونک، هتل هما، ۴۰ دقیقه",
  onLocationClick,
  searchPlaceholder = "جستجوی کالا",
  onSearchClick,
  className = "",
  ...rest
}) {
  const { overlay, overlayOpacity = 1, ...sky } = background || {};

  return (
    <header className={`top-nav ${className}`.trim()} {...rest}>
      <div className="top-nav__bg" aria-hidden="true">
        <WeatherSky {...sky} />
        {overlay && (
          <div className="top-nav__overlay" style={{ background: overlay, opacity: overlayOpacity }} />
        )}
      </div>

      <div className="top-nav__location">
        <button type="button" className="top-nav__deliver" onClick={onLocationClick}>
          <span className="top-nav__deliver-label">{deliveryLabel}</span>
          <span className="top-nav__deliver-place">{place}</span>
          <ChevronLeftCompact className="top-nav__chevron" />
        </button>
        <p className="top-nav__address">{address}</p>
      </div>

      <div className="top-nav__header">
        <button type="button" className="top-nav__search" aria-label={searchPlaceholder} onClick={onSearchClick}>
          <span className="top-nav__search-glass" aria-hidden="true" />
          <MagnifyingGlass className="top-nav__search-icon" />
          <span className="top-nav__search-text">{searchPlaceholder}</span>
          <span className="top-nav__search-stroke" aria-hidden="true" />
          <span className="top-nav__search-inner" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
