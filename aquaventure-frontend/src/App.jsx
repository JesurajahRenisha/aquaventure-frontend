import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

import SurferDashboard from './pages/surfer/SurferDashboard'
import SurferProfile from './pages/surfer/SurferProfile'
import SurfRecommendation from './pages/surfer/SurfRecommendation'
import SurfConditions from './pages/surfer/SurfConditions'
import SurfSpots from './pages/surfer/SurfSpots'
import SurfProgress from './pages/surfer/SurfProgress'
import BookLessons from './pages/surfer/BookLessons'
import BookLessonsDateTime from './pages/surfer/BookLessonsDateTime'
import BookingConfirmed from './pages/surfer/BookingConfirmed'
import BookingHistory from './pages/surfer/BookingHistory'
import SurferSettings from './pages/surfer/SurferSettings'

import ProviderDashboard from './pages/provider/ProviderDashboard'
import ProviderServices from './pages/provider/ProviderServices'
import ProviderBookings from './pages/provider/ProviderBookings'
import ProviderInstructors from './pages/provider/ProviderInstructors'
import ProviderEquipment from './pages/provider/ProviderEquipment'
import ProviderProfile from './pages/provider/ProviderProfile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProviders from './pages/admin/AdminProviders'
import AdminLocations from './pages/admin/AdminLocations'
import AdminBookings from './pages/admin/AdminBookings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/surfer" element={<ProtectedRoute role="SURFER"><SurferDashboard /></ProtectedRoute>} />
          <Route path="/surfer/profile" element={<ProtectedRoute role="SURFER"><SurferProfile /></ProtectedRoute>} />
          <Route path="/surfer/recommendation" element={<ProtectedRoute role="SURFER"><SurfRecommendation /></ProtectedRoute>} />
          <Route path="/surfer/conditions" element={<ProtectedRoute role="SURFER"><SurfConditions /></ProtectedRoute>} />
          <Route path="/surfer/spots" element={<ProtectedRoute role="SURFER"><SurfSpots /></ProtectedRoute>} />
          <Route path="/surfer/progress" element={<ProtectedRoute role="SURFER"><SurfProgress /></ProtectedRoute>} />
          <Route path="/surfer/book" element={<ProtectedRoute role="SURFER"><BookLessons /></ProtectedRoute>} />
          <Route
            path="/surfer/book/:activityId/datetime"
            element={<ProtectedRoute role="SURFER"><BookLessonsDateTime /></ProtectedRoute>}
          />
          <Route
            path="/surfer/book/confirmed/:bookingId"
            element={<ProtectedRoute role="SURFER"><BookingConfirmed /></ProtectedRoute>}
          />
          <Route path="/surfer/bookings" element={<ProtectedRoute role="SURFER"><BookingHistory /></ProtectedRoute>} />
          <Route path="/surfer/settings" element={<ProtectedRoute role="SURFER"><SurferSettings /></ProtectedRoute>} />

          <Route path="/provider" element={<ProtectedRoute role="PROVIDER"><ProviderDashboard /></ProtectedRoute>} />
          <Route path="/provider/services" element={<ProtectedRoute role="PROVIDER"><ProviderServices /></ProtectedRoute>} />
          <Route path="/provider/bookings" element={<ProtectedRoute role="PROVIDER"><ProviderBookings /></ProtectedRoute>} />
          <Route path="/provider/instructors" element={<ProtectedRoute role="PROVIDER"><ProviderInstructors /></ProtectedRoute>} />
          <Route path="/provider/equipment" element={<ProtectedRoute role="PROVIDER"><ProviderEquipment /></ProtectedRoute>} />
          <Route path="/provider/profile" element={<ProtectedRoute role="PROVIDER"><ProviderProfile /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/providers" element={<ProtectedRoute role="ADMIN"><AdminProviders /></ProtectedRoute>} />
          <Route path="/admin/locations" element={<ProtectedRoute role="ADMIN"><AdminLocations /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="ADMIN"><AdminBookings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
