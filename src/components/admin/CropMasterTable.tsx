import React from 'react';
import { CropMaster } from '../../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface CropMasterTableProps {
  crops: CropMaster[];
  onEdit: (crop: CropMaster) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const CropMasterTable: React.FC<CropMasterTableProps> = ({
  crops,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-800 text-base">Crop Master Reference Database</h4>
          <p className="text-xs text-slate-500">Admin-managed reference crop parameters used for AI grounding.</p>
        </div>
        <Button size="sm" onClick={onAddNew}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Crop Entry</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Crop Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Avg Yield / Acre</th>
              <th className="py-3 px-4">Water Requirement</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {crops.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-slate-900">{c.crop_name}</td>
                <td className="py-3.5 px-4 capitalize font-semibold text-agri-700">{c.category}</td>
                <td className="py-3.5 px-4 font-mono font-medium">{c.typical_duration_days || 'N/A'} Days</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{c.average_yield_per_acre || 'N/A'}</td>
                <td className="py-3.5 px-4 text-slate-500">{c.water_requirement || 'N/A'}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-1.5 text-slate-500 hover:text-agri-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
