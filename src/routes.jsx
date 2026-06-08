import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const BuildingCommandCenter = lazy(() => import('./pages/BuildingCommandCenter.jsx'));
const FloorOverview = lazy(() => import('./pages/FloorOverview.jsx'));
const FloorDashboard = lazy(() => import('./pages/FloorDashboard.jsx'));
const ClientWorkspace = lazy(() => import('./pages/ClientWorkspace.jsx'));
const ScadaDiagnostics = lazy(() => import('./pages/SCADADiagnostics.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/building" replace />} />
        <Route path="/building" element={<BuildingCommandCenter />} />
        <Route path="/floors" element={<FloorOverview />} />
        <Route path="/floor/:floorId" element={<FloorDashboard />} />
        <Route path="/client/:clientId" element={<ClientWorkspace />} />
        <Route path="/scada/:equipmentId" element={<ScadaDiagnostics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
