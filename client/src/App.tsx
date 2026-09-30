import SiteFooter from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ActivateEnrollment from "@/pages/ActivateEnrollment";
import Certificate from "@/pages/Certificate";
import CourseDashboard from "@/pages/CourseDashboard";
import CourseModule from "@/pages/CourseModule";
import ForgotPassword from "@/pages/ForgotPassword";
import JoinPractice from "@/pages/JoinPractice";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Disclaimer, Privacy, Refunds, Terms } from "@/pages/Policies";
import ResetPassword from "@/pages/ResetPassword";
import SpindelLogin from "@/pages/SpindelLogin";
import SpindelWelcome from "@/pages/SpindelWelcome";
import Support from "@/pages/Support";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Curriculum from "./pages/Curriculum";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/spindel" component={SpindelWelcome} />
      <Route path="/spindel/login" component={SpindelLogin} />
      <Route path="/enrollment/success" component={EnrollmentSuccess} />
      <Route path="/enrollment/activate" component={ActivateEnrollment} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/support" component={Support} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/refunds" component={Refunds} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/join/:code" component={JoinPractice} />
      <Route path="/course/module/:day" component={CourseModule} />
      <Route path="/course/certificate" component={Certificate} />
      <Route path="/course" component={CourseDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const showPublicFooter = ["/", "/curriculum"].includes(window.location.pathname);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          {showPublicFooter ? <SiteFooter /> : null}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
