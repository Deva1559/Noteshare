import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails';
import UploadNote from './pages/UploadNote';
import EditNote from './pages/EditNote';
import MyNotes from './pages/MyNotes';
import Profile from './pages/Profile';
import Subjects from './pages/Subjects';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminNotes from './pages/admin/AdminNotes';
import AdminSubjects from './pages/admin/AdminSubjects';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<NoteDetails />} />
              <Route path="/subjects" element={<Subjects />} />

              {/* Authenticated Student Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadNote />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditNote />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-notes"
                element={
                  <ProtectedRoute>
                    <MyNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notes"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminSubjects />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
