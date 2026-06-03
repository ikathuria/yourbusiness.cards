/**
 * PhoneFrame — renders a URL inside a realistic phone bezel at a true mobile
 * viewport, scaled down to fit. Used by the gallery so cards read as mobile on a
 * shared screen (key for the online demo).
 */

type PhoneFrameProps = {
  src: string;
  title: string;
  /** Logical (pre-scale) viewport size — the real px the iframe renders at. */
  logicalWidth?: number;
  logicalHeight?: number;
  scale?: number;
};

export function PhoneFrame({
  src,
  title,
  logicalWidth = 390,
  logicalHeight = 800,
  scale = 0.62,
}: PhoneFrameProps) {
  const screenW = logicalWidth * scale;
  const screenH = logicalHeight * scale;

  return (
    <div
      className="relative rounded-[2.4rem] bg-zinc-950 p-2.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
      style={{ width: screenW + 20 }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-950" />
      <div
        className="relative overflow-hidden rounded-[1.9rem] bg-black"
        style={{ width: screenW, height: screenH }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="origin-top-left border-0"
          style={{
            width: logicalWidth,
            height: logicalHeight,
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
}
