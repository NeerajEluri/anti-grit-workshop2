import React from 'react';
import { UserProfile } from '../../types';
import { Shield, UserCheck } from 'lucide-react';

interface UserManagementTableProps {
  users: UserProfile[];
  onChangeRole: (id: string, newRole: 'farmer' | 'admin') => Promise<void>;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onChangeRole }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-agri-600" />
          <span>User Role & Account Management</span>
        </h4>
        <span className="text-xs text-slate-400 font-semibold">{users.length} Total Users</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Role Assignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-slate-900">{u.full_name}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{u.phone || 'N/A'}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      u.role === 'admin'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-agri-50 text-agri-800 border-agri-200'
                    }`}
                  >
                    {u.role === 'admin' && <Shield className="w-3 h-3 text-amber-600" />}
                    <span className="capitalize">{u.role}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-medium">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => onChangeRole(u.id, e.target.value as any)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-agri-500 focus:outline-none"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="admin">Admin / Agronomist</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
