import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { NotFound } from '../pages/NotFound';

// Lazy loaded page components
const LandingPage = lazy(() => import('../pages/LandingPage'));
const CitizenDashboard = lazy(() => import('../pages/CitizenDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

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
        // Note: Add '/citizen/report' and '/citizen/complaints' routes here in the future
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
