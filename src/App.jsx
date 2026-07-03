import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { FavoritesProvider } from './context/FavoritesContext';

const Main = lazy(() => import('./pages/Main'));
const UserAnalytics = lazy(() => import('./pages/UserAnalytics'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const FooterPage = lazy(() => import('./pages/FooterPage'));

const loadingFallback = (
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#c9d1d9' }}>
    Loading…
  </div>
);

function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <Suspense fallback={loadingFallback}>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/favorites' element={<FavoritesPage />} />
            <Route path='/privacy' element={<FooterPage page="privacy" />} />
            <Route path='/terms' element={<FooterPage page="terms" />} />
            <Route path='/:username' element={<UserAnalytics />} />
          </Routes>
        </Suspense>
      </FavoritesProvider>
    </UserProvider>
  );
}

export default App;
