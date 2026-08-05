import React from 'react';
import { Bell, AlertTriangle, Droplets, TrendingUp, Check } from 'lucide-react';
import { NotificationItem } from '../../types';

interface AlertsWidgetProps {
  notifications: NotificationItem[];
  onMarkRead?: (id: string) => void;
}

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({ notifications, onMarkRead }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'disease_risk_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'irrigation_due':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'market_price_alert':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const sampleNotifications: NotificationItem[] = notifications.length > 0 ? notifications : [
    {
      id: 'n1',
      owner_id: 'user',
      type: 'disease_risk_alert',
      title: 'High Rust Spore Risk',
      message: 'Humid conditions forecast for Anand district. Consider prophylactic bio-spray on wheat.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'n2',
      owner_id: 'user',
      type: 'irrigation_due',
      title: 'Crown Root Irrigation Due',
      message: 'Green Acres Farm is at Day 21 since sowing. 50mm irrigation recommended today.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'n3',
      owner_id: 'user',
      type: 'market_price_alert',
      title: 'Chickpea Price Peak',
      message: 'Mandi prices up by 4.2% at Rajkot APMC (₹5,600/quintal). AI recommends monitoring.',
      is_read: true,
      created_at: new Date().toISOString(),
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-agri-600" />
          <span>Farm Alerts & Reminders</span>
        </h4>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {sampleNotifications.filter(n => !n.is_read).length} Unread
        </span>
      </div>

      <div className="space-y-2.5">
        {sampleNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
              n.is_read ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-agri-50/40 border-agri-200 shadow-2xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
              {getIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-bold text-slate-800 text-xs truncate">{n.title}</h5>
                <span className="text-[10px] text-slate-400 font-medium">Just now</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
            </div>
            {!n.is_read && onMarkRead && (
              <button
                onClick={() => onMarkRead(n.id)}
                title="Mark as read"
                className="text-slate-400 hover:text-emerald-600 p-1 hover:bg-white rounded-md transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
