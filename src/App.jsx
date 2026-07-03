import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Main from './pages/Main';
import UserAnalytics from './pages/UserAnalytics';
import FavoritesPage from './pages/FavoritesPage';
import FooterPage from './pages/FooterPage';

function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/favorites' element={<FavoritesPage />} />
          <Route path='/privacy' element={<FooterPage page="privacy" />} />
          <Route path='/terms' element={<FooterPage page="terms" />} />
          <Route path='/:username' element={<UserAnalytics />} />
        </Routes>
      </FavoritesProvider>
    </UserProvider>
  );
}

export default App;
