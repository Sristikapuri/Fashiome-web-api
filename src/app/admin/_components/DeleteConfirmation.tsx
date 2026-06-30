import { AlertTriangle, X } from "lucide-react";

export function DeleteConfirmation({
  onClose,
  onConfirm,
  loading,
  title = "Delete User?",
  description = "Are you sure you want to delete this user? This action cannot be undone."
}: {
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <div className="fixed inset-0 bg-[#260909]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-[#E7B8B8] overflow-hidden flex flex-col p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FFECEC] flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-[#C81A1A]" />
        </div>
        
        <h2 className="font-bold text-xl text-[#260909] mb-2">{title}</h2>
        <p className="text-sm text-[#735656] mb-6">{description}</p>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#FFF7F7] border border-[#E7B8B8] text-[#735656] font-semibold rounded-lg hover:bg-[#FFECEC] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#C81A1A] text-white font-semibold rounded-lg hover:bg-[#A41515] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
