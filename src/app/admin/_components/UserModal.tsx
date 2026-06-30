import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

const getInitialFormData = (user: any | null) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  username: user?.username || "",
  email: user?.email || "",
  role: user?.role || "user",
  age: user?.age?.toString() || "",
  gender: user?.gender || "male",
  password: "",
});

export function UserModal({
  user,
  onClose,
  onSubmit,
  loading
}: {
  user: any | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const isEditing = !!user;
  const [formData, setFormData] = useState(() => getInitialFormData(user));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!isEditing && !formData.password) newErrors.password = "Password is required for new users";
    if (formData.password && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload: any = { ...formData };
      if (!payload.password) delete payload.password; // Do not send empty password if editing
      onSubmit(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#260909]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-[#E7B8B8] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#E7B8B8] bg-[#FFF7F7] flex items-center justify-between">
          <h2 className="font-bold text-xl text-[#820000]">
            {isEditing ? "Edit User" : "Create New User"}
          </h2>
          <button onClick={onClose} className="p-2 text-[#735656] hover:text-[#820000] hover:bg-[#FFECEC] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                />
                {errors.firstName && <span className="text-xs text-red-500 mt-1">{errors.firstName}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                />
                {errors.lastName && <span className="text-xs text-red-500 mt-1">{errors.lastName}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#735656] mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
              />
              {errors.username && <span className="text-xs text-red-500 mt-1">{errors.username}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#735656] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
              />
              {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#735656] mb-1">
                  {isEditing ? "New Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? "Leave blank to keep current" : ""}
                  className="w-full bg-[#FFF7F7] border border-[#E7B8B8] rounded-lg p-2.5 focus:outline-none focus:border-[#820000]"
                />
                {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password}</span>}
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-[#E7B8B8] bg-[#FFF7F7] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#E7B8B8] text-[#735656] font-semibold rounded-lg hover:bg-[#FFECEC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={loading}
            className="px-5 py-2.5 bg-[#820000] text-white font-semibold rounded-lg hover:bg-[#A41515] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
