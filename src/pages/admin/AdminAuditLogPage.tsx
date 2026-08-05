import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { AuditLogItem } from '../../types';
import { AuditLogTable } from '../../components/admin/AuditLogTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/admin/audit-log')
      .then((res) => setLogs(res.data?.logs || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin audit trail..." />;

  return (
    <div className="space-y-6">
      <AuditLogTable logs={logs} />
    </div>
  );
};
