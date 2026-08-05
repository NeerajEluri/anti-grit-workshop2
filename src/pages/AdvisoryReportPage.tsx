import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { AdvisoryReport } from '../types';
import { AdvisoryReportView } from '../components/advisory/AdvisoryReportView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AdvisoryReportPage: React.FC = () => {
  const { advisoryId } = useParams<{ advisoryId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState<AdvisoryReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!advisoryId) return;
    api.get(`/advisory/${advisoryId}`)
      .then((res) => setReport(res.data?.report))
      .catch((err) => {
        showToast('Advisory report not found', 'error');
        navigate('/history');
      })
      .finally(() => setLoading(false));
  }, [advisoryId]);

  if (loading) return <LoadingSpinner label="Retrieving structured advisory report..." size="lg" />;
  if (!report) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <AdvisoryReportView report={report} />
    </div>
  );
};
