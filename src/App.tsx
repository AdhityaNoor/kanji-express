import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import Landing from '@/pages/Landing'
import AuthPage from '@/pages/AuthPage'
import Dashboard from '@/pages/Dashboard'
import TodaySession from '@/pages/TodaySession'
import Courses from '@/pages/Courses'
import CourseLevel from '@/pages/CourseLevel'
import Lesson from '@/pages/Lesson'
import Profile from '@/pages/Profile'
import Write from '@/pages/Write'
import StrokeLab from '@/pages/StrokeLab'
import KanjiPractice from '@/pages/KanjiPractice'
import Placeholder from '@/pages/Placeholder'
import { NAV_ITEMS } from '@/lib/nav'

const IMPLEMENTED = new Set(['/dashboard', '/courses', '/profile', '/write'])

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="session" element={<TodaySession />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:level" element={<CourseLevel />} />
          <Route path="courses/:level/:section/:lesson" element={<Lesson />} />
          <Route path="profile" element={<Profile />} />
          <Route path="write" element={<Write />} />
          <Route path="write/stroke-lab" element={<StrokeLab />} />
          <Route path="write/kanji-practice" element={<KanjiPractice />} />
          {NAV_ITEMS.filter((i) => !IMPLEMENTED.has(i.to)).map(({ to, label }) => (
            <Route key={to} path={to.slice(1)} element={<Placeholder title={label} />} />
          ))}
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Route>
      </Route>
    </Routes>
  )
}
