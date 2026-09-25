import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { DataProvider } from './context/DataContext';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/Overview';
import FloodMapping from './pages/FloodMapping';
import DroneAnalysis from './pages/DroneAnalysis';
import AffectedAreas from './pages/AffectedAreas';
import VictimDetection from './pages/VictimDetection';
import RescuePriority from './pages/RescuePriority';
import RescueRoutes from './pages/RescueRoutes';
import SituationReports from './pages/SituationReports';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <I18nProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="flood-mapping" element={<FloodMapping />} />
              <Route path="drone-analysis" element={<DroneAnalysis />} />
              <Route path="affected-areas" element={<AffectedAreas />} />
              <Route path="victim-detection" element={<VictimDetection />} />
              <Route path="rescue-priority" element={<RescuePriority />} />
              <Route path="rescue-routes" element={<RescueRoutes />} />
              <Route path="rescue-teams" element={<PlaceholderPage title="Rescue Teams" />} />
              <Route path="reports" element={<SituationReports />} />
              <Route path="data-layers" element={<PlaceholderPage title="Data Layers" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </I18nProvider>
  );
}

export default App;
