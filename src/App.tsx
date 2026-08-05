import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Guard
import { PublicLayout } from './components/layout/PublicLayout';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Farmer Pages
import { DashboardPage } from './pages/DashboardPage';
import { FarmsPage } from './pages/FarmsPage';
import { NewFarmPage } from './pages/NewFarmPage';
import { FarmDetailPage } from './pages/FarmDetailPage';
import { EditFarmPage } from './pages/EditFarmPage';
import { AdvisoryRequestPage } from './pages/AdvisoryRequestPage';
import { AdvisoryReportPage } from './pages/AdvisoryReportPage';
import { DiagnosisRequestPage } from './pages/DiagnosisRequestPage';
import { DiagnosisDetailPage } from './pages/DiagnosisDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { ChatPage } from './pages/ChatPage';
import { WeatherPage } from './pages/WeatherPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCropsPage } from './pages/admin/AdminCropsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditLogPage } from './pages/admin/AdminAuditLogPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected Authenticated Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                {/* Farmer Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/farms" element={<FarmsPage />} />
                <Route path="/farms/new" element={<NewFarmPage />} />
                <Route path="/farms/:farmId" element={<FarmDetailPage />} />
                <Route path="/farms/:farmId/edit" element={<EditFarmPage />} />
                <Route path="/advisory/new" element={<AdvisoryRequestPage />} />
                <Route path="/advisory/:advisoryId" element={<AdvisoryReportPage />} />
                <Route path="/diagnosis/new" element={<DiagnosisRequestPage />} />
                <Route path="/diagnosis/:diagnosisId" element={<DiagnosisDetailPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/market-prices" element={<MarketPricesPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/crops"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminCropsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit-log"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminAuditLogPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 Handler */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
