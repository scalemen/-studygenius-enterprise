import { Switch, Route } from "wouter";
import { useAuth } from "./hooks/use-auth";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/dashboard"));
const DashboardEnhanced = lazy(() => import("./pages/dashboard-enhanced"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Notes = lazy(() => import("./pages/notes"));
const DrawingNotes = lazy(() => import("./pages/drawing-notes"));
const NoteDetail = lazy(() => import("./pages/note-detail"));
const Flashcards = lazy(() => import("./pages/flashcards"));
const FlashcardDetail = lazy(() => import("./pages/flashcard-detail"));
const AdvancedChatbot = lazy(() => import("./pages/advanced-chatbot"));
const AdvancedMessaging = lazy(() => import("./pages/advanced-messaging"));
const HomeworkHelper = lazy(() => import("./pages/homework-helper"));
const TopicSearch = lazy(() => import("./pages/topic-search"));
const MiniGames = lazy(() => import("./pages/mini-games"));
const StudyPlanner = lazy(() => import("./pages/study-planner"));
const VirtualStudyRooms = lazy(() => import("./pages/virtual-study-rooms"));
const GroupQuiz = lazy(() => import("./pages/group-quiz"));
const CollaborativeWorkspace = lazy(() => import("./pages/collaborative-workspace"));
const CareerGuidance = lazy(() => import("./pages/career-guidance"));
const ResearchAssistant = lazy(() => import("./pages/research-assistant"));
const AdaptiveLearning = lazy(() => import("./pages/adaptive-learning"));
const LiveChat = lazy(() => import("./pages/live-chat"));
const NotFound = lazy(() => import("./pages/not-found"));

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-2xl">🎓</span>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-2xl animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">StudyGenius Enterprise</h2>
        <p className="text-gray-500">Loading your educational platform...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Component />;
}

// Public route wrapper (for login/register)
function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    window.location.href = '/dashboard';
    return <LoadingSpinner />;
  }
  
  return <Component />;
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* Public Routes */}
          <Route path="/login" component={() => <PublicRoute component={Login} />} />
          <Route path="/register" component={() => <PublicRoute component={Register} />} />
          
          {/* Protected Routes - Main Pages */}
          <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/dashboard-enhanced" component={() => <ProtectedRoute component={DashboardEnhanced} />} />
          
          {/* Note-taking Features */}
          <Route path="/notes" component={() => <ProtectedRoute component={Notes} />} />
          <Route path="/notes/:id" component={() => <ProtectedRoute component={NoteDetail} />} />
          <Route path="/drawing-notes" component={() => <ProtectedRoute component={DrawingNotes} />} />
          
          {/* Flashcard System */}
          <Route path="/flashcards" component={() => <ProtectedRoute component={Flashcards} />} />
          <Route path="/flashcards/:id" component={() => <ProtectedRoute component={FlashcardDetail} />} />
          
          {/* AI-Powered Features */}
          <Route path="/chatbot" component={() => <ProtectedRoute component={AdvancedChatbot} />} />
          <Route path="/advanced-chatbot" component={() => <ProtectedRoute component={AdvancedChatbot} />} />
          <Route path="/homework-helper" component={() => <ProtectedRoute component={HomeworkHelper} />} />
          <Route path="/topic-search" component={() => <ProtectedRoute component={TopicSearch} />} />
          <Route path="/research-assistant" component={() => <ProtectedRoute component={ResearchAssistant} />} />
          <Route path="/adaptive-learning" component={() => <ProtectedRoute component={AdaptiveLearning} />} />
          
          {/* Communication & Collaboration */}
          <Route path="/messaging" component={() => <ProtectedRoute component={AdvancedMessaging} />} />
          <Route path="/advanced-messaging" component={() => <ProtectedRoute component={AdvancedMessaging} />} />
          <Route path="/live-chat" component={() => <ProtectedRoute component={LiveChat} />} />
          <Route path="/virtual-study-rooms" component={() => <ProtectedRoute component={VirtualStudyRooms} />} />
          <Route path="/collaborative-workspace" component={() => <ProtectedRoute component={CollaborativeWorkspace} />} />
          
          {/* Educational Tools */}
          <Route path="/mini-games" component={() => <ProtectedRoute component={MiniGames} />} />
          <Route path="/mini-games/:gameId" component={() => <ProtectedRoute component={MiniGames} />} />
          <Route path="/group-quiz" component={() => <ProtectedRoute component={GroupQuiz} />} />
          <Route path="/study-planner" component={() => <ProtectedRoute component={StudyPlanner} />} />
          
          {/* Career & Professional Development */}
          <Route path="/career-guidance" component={() => <ProtectedRoute component={CareerGuidance} />} />
          
          {/* 404 Not Found */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
