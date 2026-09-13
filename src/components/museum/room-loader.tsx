import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";

export function RoomLoader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const delay = useRef(0);

  useEffect(() => {
    const show = () => {
      window.clearTimeout(delay.current);
      delay.current = window.setTimeout(() => setOpen(true), 160);
    };
    const hide = () => {
      window.clearTimeout(delay.current);
      setOpen(false);
    };
    const offBefore = router.subscribe("onBeforeNavigate", show);
    const offRendered = router.subscribe("onRendered", hide);
    const offLoad = router.subscribe("onLoad", hide);
    return () => {
      offBefore();
      offRendered();
      offLoad();
      window.clearTimeout(delay.current);
    };
  }, [router]);

  if (!open) return null;

  return (
    <div className="room-loader" role="status" aria-live="polite" aria-label="Opening a room">
      <div className="room-loader-card">
        <span className="room-loader-tape" aria-hidden="true" />
        <span className="room-loader-heart" aria-hidden="true">
          ♡
        </span>
        <p>opening a room…</p>
      </div>
    </div>
  );
}