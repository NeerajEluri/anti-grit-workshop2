import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { UserProfile } from '../../types';
import { UserManagementTable } from '../../components/admin/UserManagementTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: string, newRole: 'farmer' | 'admin') => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      showToast('User role updated successfully!', 'success');
      await fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update user role', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading user registry..." />;

  return (
    <div className="space-y-6">
      <UserManagementTable users={users} onChangeRole={handleChangeRole} />
    </div>
  );
};
