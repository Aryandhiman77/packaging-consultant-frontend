export default function ContentWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        className="absolute top-1/2 left-1/2 w-[52%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 opacity-[.13]"
        src="/assets/site/header-mark-clean.png"
        alt=""
      />
    </div>
  )
}
