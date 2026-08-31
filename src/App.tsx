import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logOut, onAuthStateChanged, syncUserProfile } from './lib/firebase';
import { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ThreatModelModal } from './components/ThreatModelModal';
import { TestWalkthroughModal } from './components/TestWalkthroughModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'history' | 'ask'>('write');
  const [entriesCount, setEntriesCount] = useState(0);

  // Modals state
  const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);
  const [isTestWalkthroughOpen, setIsTestWalkthroughOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);
        syncUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setActionLoading(true);
    setAuthError(null);
    try {
      const fbUser = await signInWithGoogle();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
      };
      setUser(profile);
      await syncUserProfile(fbUser);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing. Please try again.');
      } else {
        setAuthError(err?.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setUser(null);
      setActiveTab('write');
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#242220] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#638466]/20 border-t-[#638466] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#666057]">Initializing Sonderly Security Context...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#242220] flex flex-col font-sans antialiased selection:bg-[#638466] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSignOut={handleSignOut}
        onNewEntry={() => setActiveTab('write')}
        onOpenThreatModel={() => setIsThreatModalOpen(true)}
        onOpenTestWalkthrough={() => setIsTestWalkthroughOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        entriesCount={entriesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!user ? (
          <LandingPage
            onSignIn={handleSignIn}
            isLoading={actionLoading}
            errorMessage={authError}
            onOpenThreatModel={() => setIsThreatModalOpen(true)}
          />
        ) : (
          <Dashboard
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onEntriesCountChange={setEntriesCount}
          />
        )}
      </main>

      {/* Threat Model Modal */}
      <ThreatModelModal
        isOpen={isThreatModalOpen}
        onClose={() => setIsThreatModalOpen(false)}
      />

      {/* Test Walkthrough Modal */}
      <TestWalkthroughModal
        isOpen={isTestWalkthroughOpen}
        onClose={() => setIsTestWalkthroughOpen(false)}
      />
    </div>
  );
}
