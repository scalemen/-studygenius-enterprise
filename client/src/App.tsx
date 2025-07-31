import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { CollaborationProvider } from '@/components/providers/collaboration-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { PWAProvider } from '@/components/providers/pwa-provider';
import { Layout } from '@/components/layout/layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorFallback } from '@/components/ui/error-fallback';
import { useAuth } from '@/hooks/use-auth';
import '@/styles/globals.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/home'));
const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const NotesPage = lazy(() => import('@/pages/notes'));
const FlashcardsPage = lazy(() => import('@/pages/flashcards'));
const QuizzesPage = lazy(() => import('@/pages/quizzes'));
const StudyRoomsPage = lazy(() => import('@/pages/study-rooms'));
const GamesPage = lazy(() => import('@/pages/games'));
const AnalyticsPage = lazy(() => import('@/pages/analytics'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const AITutorPage = lazy(() => import('@/pages/ai-tutor'));
const GroupsPage = lazy(() => import('@/pages/groups'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const PricingPage = lazy(() => import('@/pages/pricing'));
const AboutPage = lazy(() => import('@/pages/about'));
const ContactPage = lazy(() => import('@/pages/contact'));
const PrivacyPage = lazy(() => import('@/pages/privacy'));
const TermsPage = lazy(() => import('@/pages/terms'));
const NotFoundPage = lazy(() => import('@/pages/404'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Loading Component for Suspense
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
      <span className="ml-3 text-lg font-medium">Loading...</span>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <SocketProvider>
                  <CollaborationProvider>
                    <PWAProvider>
                      <Router>
                        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
                          <Routes>
                            {/* Public Routes */}
                            <Route
                              path="/"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <HomePage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/login"
                              element={
                                <PublicRoute>
                                  <Suspense fallback={<PageLoader />}>
                                    <LoginPage />
                                  </Suspense>
                                </PublicRoute>
                              }
                            />
                            <Route
                              path="/register"
                              element={
                                <PublicRoute>
                                  <Suspense fallback={<PageLoader />}>
                                    <RegisterPage />
                                  </Suspense>
                                </PublicRoute>
                              }
                            />
                            <Route
                              path="/pricing"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <PricingPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/about"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <AboutPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/contact"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <ContactPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/privacy"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <PrivacyPage />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/terms"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <TermsPage />
                                </Suspense>
                              }
                            />

                            {/* Protected Routes with Layout */}
                            <Route
                              path="/dashboard"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <DashboardPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/notes/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <NotesPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/flashcards/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <FlashcardsPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/quizzes/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <QuizzesPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/study-rooms/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <StudyRoomsPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/games/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <GamesPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/ai-tutor"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <AITutorPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/groups/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <GroupsPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/analytics"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <AnalyticsPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <ProfilePage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/settings"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Suspense fallback={<PageLoader />}>
                                      <SettingsPage />
                                    </Suspense>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />

                            {/* 404 Page */}
                            <Route
                              path="*"
                              element={
                                <Suspense fallback={<PageLoader />}>
                                  <NotFoundPage />
                                </Suspense>
                              }
                            />
                          </Routes>
                        </div>
                      </Router>

                      {/* Global Components */}
                      <Toaster />
                    </PWAProvider>
                  </CollaborationProvider>
                </SocketProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;