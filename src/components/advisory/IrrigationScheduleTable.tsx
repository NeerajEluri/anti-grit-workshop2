import React from 'react';
import { IrrigationScheduleItem } from '../../types';
import { Droplets } from 'lucide-react';

interface IrrigationScheduleTableProps {
  schedule: IrrigationScheduleItem[];
}

export const IrrigationScheduleTable: React.FC<IrrigationScheduleTableProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-sky-50/50 border-b border-slate-200 flex items-center gap-2">
        <Droplets className="w-5 h-5 text-sky-600" />
        <h4 className="font-extrabold text-slate-800 text-base">Irrigation & Water Conservation Schedule</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Crop</th>
              <th className="py-3 px-4">Critical Growth Stage</th>
              <th className="py-3 px-4">Irrigation Frequency</th>
              <th className="py-3 px-4">Water Volume / Depth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {schedule.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{item.crop_name}</td>
                <td className="py-3.5 px-4 font-medium text-sky-800">{item.growth_stage}</td>
                <td className="py-3.5 px-4 text-slate-600">{item.frequency}</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{item.water_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
