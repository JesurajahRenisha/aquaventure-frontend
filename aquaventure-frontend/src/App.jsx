import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import SchoolSearch from './pages/public/SchoolSearch'
import SchoolDetail from './pages/public/SchoolDetail'
import SchoolCompare from './pages/public/SchoolCompare'

import SurferDashboard from './pages/surfer/SurferDashboard'
import SurferProfile from './pages/surfer/SurferProfile'
import SurfRecommendation from './pages/surfer/SurfRecommendation'
import SurfConditions from './pages/surfer/SurfConditions'
import SurfSpots from './pages/surfer/SurfSpots'
import SurfProgress from './pages/surfer/SurfProgress'
import BookLessonSlot from './pages/surfer/BookLessonSlot'
import BookingConfirmed from './pages/surfer/BookingConfirmed'
import BookingHistory from './pages/surfer/BookingHistory'

import SchoolDashboard from './pages/school/SchoolDashboard'
import SchoolProfile from './pages/school/SchoolProfile'
import SchoolLessons from './pages/school/SchoolLessons'
import SchoolSlots from './pages/school/SchoolSlots'
import SchoolInstructors from './pages/school/SchoolInstructors'
import SchoolEquipment from './pages/school/SchoolEquipment'
import SchoolBookings from './pages/school/SchoolBookings'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSchools from './pages/admin/AdminSchools'
import AdminLocations from './pages/admin/AdminLocations'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/schools" element={<SchoolSearch />} />
          <Route path="/schools/compare" element={<SchoolCompare />} />
          <Route path="/schools/:id" element={<SchoolDetail />} />

          <Route path="/surfer" element={<ProtectedRoute role="SURFER"><SurferDashboard /></ProtectedRoute>} />
          <Route path="/surfer/profile" element={<ProtectedRoute role="SURFER"><SurferProfile /></ProtectedRoute>} />
          <Route path="/surfer/recommendation" element={<ProtectedRoute role="SURFER"><SurfRecommendation /></ProtectedRoute>} />
          <Route path="/surfer/conditions" element={<ProtectedRoute role="SURFER"><SurfConditions /></ProtectedRoute>} />
          <Route path="/surfer/spots" element={<ProtectedRoute role="SURFER"><SurfSpots /></ProtectedRoute>} />
          <Route path="/surfer/progress" element={<ProtectedRoute role="SURFER"><SurfProgress /></ProtectedRoute>} />
          <Route
            path="/surfer/book/:schoolId/:lessonId"
            element={<ProtectedRoute role="SURFER"><BookLessonSlot /></ProtectedRoute>}
          />
          <Route path="/surfer/book/confirmed" element={<ProtectedRoute role="SURFER"><BookingConfirmed /></ProtectedRoute>} />
          <Route path="/surfer/bookings" element={<ProtectedRoute role="SURFER"><BookingHistory /></ProtectedRoute>} />

          <Route path="/school" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolDashboard /></ProtectedRoute>} />
          <Route path="/school/profile" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolProfile /></ProtectedRoute>} />
          <Route path="/school/lessons" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolLessons /></ProtectedRoute>} />
          <Route path="/school/slots" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolSlots /></ProtectedRoute>} />
          <Route path="/school/instructors" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolInstructors /></ProtectedRoute>} />
          <Route path="/school/equipment" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolEquipment /></ProtectedRoute>} />
          <Route path="/school/bookings" element={<ProtectedRoute role="SCHOOL_ADMIN"><SchoolBookings /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="PLATFORM_ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="PLATFORM_ADMIN"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/schools" element={<ProtectedRoute role="PLATFORM_ADMIN"><AdminSchools /></ProtectedRoute>} />
          <Route path="/admin/locations" element={<ProtectedRoute role="PLATFORM_ADMIN"><AdminLocations /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
