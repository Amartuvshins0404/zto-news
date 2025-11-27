
import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArticlePage } from './pages/Article';

import { EditorPage } from './pages/Editor';
import { FacesPage } from './pages/Faces';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { VoicesPage } from './pages/Voices';
import { AuthProvider } from './services/authContext';
import { TranslationProvider } from './services/translationService';

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/voices" element={<VoicesPage />} />
              <Route path="/faces" element={<FacesPage />} />

              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/editor" element={
                <RequireAuth>
                  <EditorPage />
                </RequireAuth>
              } />
              <Route path="/editor/:id" element={
                <RequireAuth>
                  <EditorPage />
                </RequireAuth>
              } />
              <Route path="/admin" element={
                <RequireAuth requiredRole={['admin', 'super_admin']}>
                  <AdminDashboard />
                </RequireAuth>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </TranslationProvider>
  );
};

export default App;
