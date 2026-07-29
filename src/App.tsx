import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import AuthPage from '@/pages/AuthPage'
import Dashboard from '@/pages/Dashboard'
import Courses from '@/pages/Courses'
import CourseLevel from '@/pages/CourseLevel'
import Lesson from '@/pages/Lesson'
import Profile from '@/pages/Profile'
import Placeholder from '@/pages/Placeholder'
import { NAV_ITEMS } from '@/lib/nav'

// Routes that have real pages — everything else in the nav falls back to a shell.
const IMPLEMENTED = new Set(['/', '/courses', '/profile'])

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<AuthPage />} />

      {/* Everything below requires authentication */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:level" element={<CourseLevel />} />
          <Route path="courses/:level/:section/:lesson" element={<Lesson />} />
          <Route path="profile" element={<Profile />} />
          {NAV_ITEMS.filter((i) => !IMPLEMENTED.has(i.to)).map(({ to, label }) => (
            <Route key={to} path={to.slice(1)} element={<Placeholder title={label} />} />
          ))}
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Route>
      </Route>
    </Routes>
  )
}
