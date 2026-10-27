export default function ContentWatermark({ repeat = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        className="absolute top-[27%] left-1/2 w-[64%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 -rotate-[11deg] opacity-[.18]"
        src="/assets/site/header-mark-clean.png"
        alt=""
      />
      {repeat && (
        <img
          className="absolute top-[72%] left-1/2 w-[64%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 rotate-[10deg] opacity-[.14]"
          src="/assets/site/header-mark-clean.png"
          alt=""
        />
      )}
    </div>
  )
}
