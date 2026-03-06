import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoutes from './routes/AdminRoutes';
import CPRoutes from './routes/CPRoutes'; // Add this import
import RMRoutes from './routes/RMRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginSignup from './components/LoginSignup';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './components/PropertyDetail';
import UserPortfolio from './pages/UserPortfolio';
import WalletDashboard from './pages/WalletDashboard';
import Wishlist from './pages/Wishlist';
import PropertyAnalytics from './pages/PropertyAnalytics';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import MyInvestments from './components/MyInvestments';
import UserDocuments from './components/UserDocuments';
import './App.css';
import './styles/GlobalSizingAdjustments.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* ========================================
                ADMIN ROUTES - No Header/Footer
                ======================================== */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* ========================================
                CP ROUTES - No Header/Footer (they have their own)
                ======================================== */}
            <Route path="/cp/*" element={<CPRoutes />} />


             <Route path="/rm/*" element={<RMRoutes />} />

            {/* ========================================
                LOGIN ROUTE - No Header/Footer
                ======================================== */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/signup" element={<LoginSignup />} /> {/* ← ADD THIS */}

            {/* ========================================
                USER ROUTES - With Header/Footer
                ======================================== */}
            <Route 
              path="/*" 
              element={
                <>
                  <Header />
                  <Routes>
                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />

                    <Route path="/my-investments" element={<ProtectedRoute><MyInvestments /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><UserDocuments /></ProtectedRoute>} />
                    
                    <Route 
                      path="/properties" 
                      element={
                        <ProtectedRoute>
                          <Properties />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/properties/:propertyId" 
                      element={
                        <ProtectedRoute>
                          <PropertyDetail />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/analytics/:slug" 
                      element={
                        <ProtectedRoute>
                          <PropertyAnalytics />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/wallet" 
                      element={
                        <ProtectedRoute>
                          <WalletDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/portfolio" 
                      element={
                        <ProtectedRoute>
                          <UserPortfolio />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
  path="/portfolio/analytics" 
  element={
    <ProtectedRoute>
      <PortfolioAnalytics />
    </ProtectedRoute>
  } 
/>
                    
                    <Route 
                      path="/wishlist" 
                      element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
