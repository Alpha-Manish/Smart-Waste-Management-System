import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { NotFound } from '../pages/NotFound';

// Lazy loaded page components
const LandingPage = lazy(() => import('../pages/LandingPage'));
const CitizenDashboard = lazy(() => import('../pages/CitizenDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const ReportComplaint = lazy(() => import('../pages/ReportComplaint'));
const MyComplaints = lazy(() => import('../pages/MyComplaints'));
const ComplaintDetails = lazy(() => import('../pages/ComplaintDetails'));

// Reusable loading fallback
const PageLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
  </div>
);

export const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<PageLoader />}>
          <LandingPage />
        </Suspense>
      ),
    },
    {
      path: '/citizen',
      element: <CitizenLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <CitizenDashboard />
            </Suspense>
          ),
        },
        {
          path: 'report',
          element: (
            <Suspense fallback={<PageLoader />}>
              <ReportComplaint />
            </Suspense>
          ),
        },
        {
          path: 'complaints',
          element: (
            <Suspense fallback={<PageLoader />}>
              <MyComplaints />
            </Suspense>
          ),
        },
        {
          path: 'complaints/:id',
          element: (
            <Suspense fallback={<PageLoader />}>
              <ComplaintDetails />
            </Suspense>
          ),
        },
      ]
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          ),
        },
        // Note: Add other admin routes here in the future
      ]
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
};
