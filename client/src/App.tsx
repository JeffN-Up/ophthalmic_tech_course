import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const FreePreview = lazy(() => import("./pages/FreePreview"));
const BuyerGuide = lazy(() => import("./pages/BuyerGuide"));
const FirstSale = lazy(() => import("./pages/FirstSale"));
const Learn = lazy(() => import("./pages/Learn"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Policies = lazy(() => import("./pages/Policies"));
const SkillsPassport = lazy(() => import("./pages/SkillsPassport"));
const CareerToolkit = lazy(() => import("./pages/CareerToolkit"));
const OnboardingAssessment = lazy(() => import("./pages/OnboardingAssessment"));
const SpindelOnboarding = lazy(() => import("./pages/SpindelOnboarding"));
const PracticePacks = lazy(() => import("./pages/PracticePacks"));
const PracticeSeatAdmin = lazy(() => import("./pages/PracticeSeatAdmin"));
const CertificatePreview = lazy(() => import("./pages/CertificatePreview"));
const LaunchReadiness = lazy(() => import("./pages/LaunchReadiness"));
const AdminAlertTemplates = lazy(() => import("./pages/AdminAlertTemplates"));
const SendAlerts = lazy(() => import("./pages/SendAlerts"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700">
      <div className="rounded-md border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm">
        Loading OptiTech Academy...
      </div>
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/preview"} component={FreePreview} />
      <Route path={"/buyer-guide"} component={BuyerGuide} />
      <Route path={"/first-sale"} component={FirstSale} />
      <Route path={"/curriculum"} component={Curriculum} />
      <Route path={"/learn"} component={Learn} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/policies"} component={Policies} />
      <Route path={"/skills-passport"} component={SkillsPassport} />
      <Route path={"/career-toolkit"} component={CareerToolkit} />
      <Route path={"/onboarding"} component={OnboardingAssessment} />
      <Route path={"/spindel-onboarding"} component={SpindelOnboarding} />
      <Route path={"/practice-packs"} component={PracticePacks} />
      <Route path={"/practice-seat-admin"} component={PracticeSeatAdmin} />
      <Route path={"/certificate-preview"} component={CertificatePreview} />
      <Route path={"/launch-readiness"} component={LaunchReadiness} />
      <Route path={"/send"} component={SendAlerts} />
      <Route path={"/admin"} component={AdminAlertTemplates} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<PageLoading />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
