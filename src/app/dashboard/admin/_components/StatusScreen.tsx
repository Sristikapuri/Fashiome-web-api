import type { ReactNode } from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-[#e7c7bc] border-t-[#311812] ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function StatusScreen({
  code,
  title,
  description,
  children,
}: {
  code?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 h-1 w-16 rounded-full bg-[#a43a24]" />
      {code ? <p className="mb-2 font-mono text-5xl font-black text-[#311812]">{code}</p> : null}
      <h2 className="text-2xl font-black text-[#311812]">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-[#6f574f]">{description}</p> : null}
      {children ? <div className="mt-6 flex items-center gap-3">{children}</div> : null}
    </div>
  );
}
