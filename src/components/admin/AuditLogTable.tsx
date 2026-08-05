import React from 'react';
import { AuditLogItem } from '../../types';
import { ScrollText, Shield } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLogItem[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-amber-600" />
          <span>Immutable Admin Mutation Audit Trail</span>
        </h4>
        <span className="text-xs text-slate-400 font-semibold">{logs.length} Audit Entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Table</th>
              <th className="py-3 px-4">Target ID</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                  <span className="bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{log.target_table}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{log.target_id || 'N/A'}</td>
                <td className="py-3.5 px-4 text-slate-400 font-medium">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
