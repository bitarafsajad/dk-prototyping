import { useEffect, useState } from "react";
import "./Carousel.css";

const fa = (n) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

function Chevron() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9.21976 5.46976C9.51265 5.17687 9.98742 5.17687 10.2803 5.46976C10.5732 5.76265 10.5732 6.23742 10.2803 6.53031L7.81058 9.00004L10.2803 11.4698C10.5732 11.7627 10.5732 12.2374 10.2803 12.5303C9.98742 12.8232 9.51265 12.8232 9.21976 12.5303L6.21976 9.53031C5.92687 9.23742 5.92687 8.76265 6.21976 8.46976L9.21976 5.46976Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Live hh:mm:ss countdown to `endsAt` (Date | ms timestamp). */
function useCountdown(endsAt) {
  const target = endsAt ? new Date(endsAt).getTime() : 0;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const left = Math.max(0, Math.floor((target - now) / 1000));
  return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60];
}

function Countdown({ endsAt }) {
  const [h, m, s] = useCountdown(endsAt);
  return (
    <div className="sheading__timer" role="timer" aria-label={`${h} ساعت و ${m} دقیقه و ${s} ثانیه مانده`}>
      <span className="sheading__digits">{fa(h)}</span>
      <span className="sheading__sep">:</span>
      <span className="sheading__digits">{fa(m)}</span>
      <span className="sheading__sep">:</span>
      <span className="sheading__digits">{fa(s)}</span>
    </div>
  );
}

/**
 * SectionHeading
 *  title, description, href / onClick (title row → "see all")
 *  appearance "light" | "dark"
 *  endsAt     shows the countdown variant when set
 *  hasArrowIcon (default true)
 *  visual     extra vertical padding used by the visualized carousel
 */
export default function SectionHeading({
  title,
  description,
  appearance = "light",
  endsAt,
  hasArrowIcon = true,
  href,
  onClick,
  visual = false,
}) {
  const Row = href ? "a" : "button";
  return (
    <div className={`sheading sheading--${appearance}${visual ? " sheading--visual" : ""}`}>
      <div className="sheading__text">
        <h2 style={{ margin: 0, font: "inherit" }}>
          <Row className="sheading__titleRow" href={href} type={href ? undefined : "button"} onClick={onClick}>
            <span className="sheading__title">{title}</span>
            {hasArrowIcon && <span className="sheading__arrow"><Chevron /></span>}
          </Row>
        </h2>
        {description && <p className="sheading__desc">{description}</p>}
      </div>
      {endsAt && <Countdown endsAt={endsAt} />}
    </div>
  );
}
