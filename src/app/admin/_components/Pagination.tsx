export function Pagination({ meta, onPageChange }: { meta: any, onPageChange: (page: number) => void }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-[#E7B8B8] shadow-sm">
      <p className="text-sm text-[#735656]">
        Showing page <span className="font-bold text-[#820000]">{meta.page}</span> of{" "}
        <span className="font-bold text-[#820000]">{meta.totalPages}</span> ({meta.total} total users)
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="px-4 py-2 bg-[#FFF7F7] border border-[#E7B8B8] text-[#820000] font-semibold rounded-lg disabled:opacity-50 hover:bg-[#FFECEC] transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="px-4 py-2 bg-[#FFF7F7] border border-[#E7B8B8] text-[#820000] font-semibold rounded-lg disabled:opacity-50 hover:bg-[#FFECEC] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
