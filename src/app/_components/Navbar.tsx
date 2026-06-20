import Link from "next/link";

export default function Navbar() {
  return (
    <header className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center bg-[#FFF7F7] px-8 py-5 max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-5 max-[900px]:py-4">
      <Link href="/" className="font-serif text-[26px] font-bold text-[#820000] no-underline justify-self-start">
        FashioMe
      </Link>
      <nav
        className="flex flex-wrap items-center justify-self-center gap-9 max-[900px]:hidden"
        aria-label="Main"
      >
        <Link href="/" className="text-[13px] font-medium tracking-wide text-[#A41515] uppercase underline underline-offset-4 no-underline" aria-current="page">
          Home
        </Link>
        <a href="#dashboard" className="text-[13px] font-medium tracking-wide text-[#735656] uppercase no-underline transition-colors hover:text-[#A41515]">
          Dashboard
        </a>
        <a href="#recommendations" className="text-[13px] font-medium tracking-wide text-[#735656] uppercase no-underline transition-colors hover:text-[#A41515]">
          Recommendations
        </a>
      </nav>
      <div className="justify-self-end">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#A41515] bg-[#FFECEC] text-[#820000]"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </header>
  );
}
