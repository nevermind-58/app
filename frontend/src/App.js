import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalStyle from './styles/GlobalStyle';
import Navbar from './components/Shared/Navbar';
import PasswordPrompt from './components/Shared/PasswordPrompt';
import Home from './components/Home/Home';
import WatchList from './components/WatchList/WatchList';
import Wishlist from './components/Wishlist/Wishlist';
import Timeline from './components/Timeline/Timeline';
import Notes from './components/Notes/Notes';

const ProtectedApp = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasswordPrompt />;
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <ProtectedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;