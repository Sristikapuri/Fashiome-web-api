import { Edit2, Trash2 } from "lucide-react";

export function UserTable({ 
  users, 
  onEdit, 
  onDelete 
}: { 
  users: any[]; 
  onEdit: (user: any) => void; 
  onDelete: (user: any) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E7B8B8] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FFF7F7] border-b border-[#E7B8B8]">
            <tr>
              <th className="px-6 py-4 font-bold text-[#820000]">Name</th>
              <th className="px-6 py-4 font-bold text-[#820000]">Email</th>
              <th className="px-6 py-4 font-bold text-[#820000]">Role</th>
              <th className="px-6 py-4 font-bold text-[#820000]">Joined</th>
              <th className="px-6 py-4 font-bold text-[#820000] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7B8B8]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#735656]">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-[#FFF7F7]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#260909]">
                    {user.firstName} {user.lastName}
                    <div className="text-xs text-[#735656]">@{user.username}</div>
                  </td>
                  <td className="px-6 py-4 text-[#735656]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-[#820000] text-white' 
                        : 'bg-[#FFECEC] text-[#820000]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#735656]">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(user)}
                        className="p-2 text-[#735656] hover:text-[#820000] hover:bg-[#FFECEC] rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(user)}
                        className="p-2 text-[#735656] hover:text-[#C81A1A] hover:bg-[#FFECEC] rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
