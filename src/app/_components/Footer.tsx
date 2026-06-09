import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#ebe6e2] bg-[#FAF7F4] px-8 pt-12 pb-10 max-[600px]:px-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-10 max-[600px]:flex-col max-[600px]:items-start">
        <div className="max-w-[380px]">
          <Link href="/" className="font-serif text-[1.15rem] font-bold text-[#9498C1] no-underline mb-3.5 inline-block">
            FashioMe
          </Link>
          <p className="text-sm leading-[1.65] text-[#6B5B4B]">
            Curating global elegance with advanced artificial intelligence for
            the modern style enthusiast.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-7 max-[600px]:gap-5">
          <nav className="flex flex-wrap gap-7 max-[600px]:gap-5" aria-label="Footer">
            <a href="#dashboard" className="text-[13px] font-medium text-[#6B5B4B] no-underline whitespace-nowrap transition-colors hover:text-[#D4AF37]">
              About
            </a>
            <a href="#recommendations" className="text-[13px] font-medium text-[#6B5B4B] no-underline whitespace-nowrap transition-colors hover:text-[#D4AF37]">
              Style Guide
            </a>
            <a href="#recommendations" className="text-[13px] font-medium text-[#6B5B4B] no-underline whitespace-nowrap transition-colors hover:text-[#D4AF37]">
              Terms
            </a>
            <Link href="/login" className="text-[13px] font-medium text-[#6B5B4B] no-underline whitespace-nowrap transition-colors hover:text-[#D4AF37]">
              Support
            </Link>
          </nav>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF37] bg-white p-0 text-[#9498C1] transition-colors hover:border-[#9498C1]"
              aria-label="Language"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9M12 3c-2.5 3-4 6-4 9s1.5 6 4 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF37] bg-white p-0 text-[#9498C1] transition-colors hover:border-[#9498C1]"
              aria-label="Share"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M8.5 11l7-4M8.5 13l7 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
