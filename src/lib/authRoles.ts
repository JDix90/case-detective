import { useAuth } from '../contexts/AuthContext';
import type { UserProfile, UserRole } from '../types';

/** For admins, which student/teacher experience is active. Ignored for non-admins. */
export function useEffectiveRole(): 'student' | 'teacher' {
  const { profile, effectiveRole } = useAuth();
  if (profile?.role === 'admin') return effectiveRole;
  return profile?.role === 'teacher' ? 'teacher' : 'student';
}

export function isAdmin(profile: UserProfile | null | undefined): boolean {
  return profile?.role === 'admin';
}

/** Route guard: whether `profile` may access a route that requires `requiredRole`. */
export function canAccessRoute(
  profile: UserProfile,
  requiredRole: UserRole,
  effectiveRole: 'student' | 'teacher'
): boolean {
  if (profile.role === 'admin') {
    if (requiredRole === 'admin') return true;
    return effectiveRole === requiredRole;
  }
  return profile.role === requiredRole;
}
