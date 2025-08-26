import { auth } from '@/auth';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ComprehensiveProfile from './comprehensive-profile';
import ProfileErrorBoundary from './profile-error-boundary';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const Profile = async () => {
  const session = await auth();

  // Ensure user is authenticated
  if (!session || !session.user) {
    redirect('/sign-in');
  }

  // Get user role from session
  const userRole = session.user.role;

  return (
    <SessionProvider session={session}>
      <div className='max-w-4xl mx-auto space-y-10'>
        <h2 className='h2-bold mt-10'>Profile</h2>
        {userRole === 'user' ? (
          <ProfileErrorBoundary>
            <ComprehensiveProfile />
          </ProfileErrorBoundary>
        ) : (
          <div className='max-w-md mx-auto'>
            <ProfileForm />
          </div>
        )}
      </div>
    </SessionProvider>
  );
};

export default Profile;