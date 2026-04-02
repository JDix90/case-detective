import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { RoleRedirect } from './components/auth/RoleRedirect';
import { AdminRoleBar } from './components/admin/AdminRoleBar';
import { useGameStore } from './store/gameStore';

import { LoginScreen } from './screens/auth/LoginScreen';
import { SignUpScreen } from './screens/auth/SignUpScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { SettingsScreen } from './screens/home/SettingsScreen';
import { LearnScreen } from './screens/learn/LearnScreen';
import { PracticeScreen } from './screens/practice/PracticeScreen';
import { SpeedScreen } from './screens/speed/SpeedScreen';
import { BossScreen } from './screens/boss/BossScreen';
import { MemoryScreen } from './screens/memory/MemoryScreen';
import { GridScreen } from './screens/grid/GridScreen';
import { ResultsScreen } from './screens/results/ResultsScreen';

import { TeacherDashboard } from './screens/teacher/TeacherDashboard';
import { ClassListScreen } from './screens/teacher/ClassListScreen';
import { ClassDetailScreen } from './screens/teacher/ClassDetailScreen';
import { StudentDetailScreen } from './screens/teacher/StudentDetailScreen';
import { AssignmentFormScreen } from './screens/teacher/AssignmentFormScreen';
import { AnalyticsScreen } from './screens/teacher/AnalyticsScreen';

import { JoinClassScreen } from './screens/student/JoinClassScreen';
import { AssignmentsScreen } from './screens/student/AssignmentsScreen';

import { AdminDashboard } from './screens/admin/AdminDashboard';
import { AdminUsersScreen } from './screens/admin/AdminUsersScreen';
import { AdminClassesScreen } from './screens/admin/AdminClassesScreen';
import { AdminSiteSettingsScreen } from './screens/admin/AdminSiteSettingsScreen';

function AppInit() {
  const { init, initForUser } = useGameStore();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      initForUser(profile.id);
    } else {
      init();
    }
  }, [profile, init, initForUser]);

  return null;
}

function AppRoutes() {
  const { profile } = useAuth();
  return (
    <>
      <AdminRoleBar />
      <div className={profile?.role === 'admin' ? 'pt-24' : undefined}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />

          {/* Role-based redirect at root */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Student / shared game routes */}
          <Route path="/home" element={<RequireAuth><HomeScreen /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><SettingsScreen /></RequireAuth>} />
          <Route path="/learn" element={<RequireAuth><LearnScreen /></RequireAuth>} />
          <Route path="/practice" element={<RequireAuth><PracticeScreen /></RequireAuth>} />
          <Route path="/speed" element={<RequireAuth><SpeedScreen /></RequireAuth>} />
          <Route path="/boss" element={<RequireAuth><BossScreen /></RequireAuth>} />
          <Route path="/memory" element={<RequireAuth><MemoryScreen /></RequireAuth>} />
          <Route path="/grid" element={<RequireAuth><GridScreen /></RequireAuth>} />
          <Route path="/results" element={<RequireAuth><ResultsScreen /></RequireAuth>} />
          <Route path="/join-class" element={<RequireAuth requiredRole="student"><JoinClassScreen /></RequireAuth>} />
          <Route path="/assignments" element={<RequireAuth requiredRole="student"><AssignmentsScreen /></RequireAuth>} />

          {/* Teacher routes */}
          <Route path="/teacher" element={<RequireAuth requiredRole="teacher"><TeacherDashboard /></RequireAuth>} />
          <Route path="/teacher/classes" element={<RequireAuth requiredRole="teacher"><ClassListScreen /></RequireAuth>} />
          <Route path="/teacher/class/:classId" element={<RequireAuth requiredRole="teacher"><ClassDetailScreen /></RequireAuth>} />
          <Route path="/teacher/student/:studentId" element={<RequireAuth requiredRole="teacher"><StudentDetailScreen /></RequireAuth>} />
          <Route path="/teacher/assign/:classId" element={<RequireAuth requiredRole="teacher"><AssignmentFormScreen /></RequireAuth>} />
          <Route path="/teacher/analytics/:classId" element={<RequireAuth requiredRole="teacher"><AnalyticsScreen /></RequireAuth>} />

          {/* Admin */}
          <Route path="/admin" element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth requiredRole="admin"><AdminUsersScreen /></RequireAuth>} />
          <Route path="/admin/classes" element={<RequireAuth requiredRole="admin"><AdminClassesScreen /></RequireAuth>} />
          <Route path="/admin/site" element={<RequireAuth requiredRole="admin"><AdminSiteSettingsScreen /></RequireAuth>} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInit />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
