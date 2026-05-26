import { Providers } from "@/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ComplianceMonitor } from "@/components/compliance-monitor";
import { ErrorBoundary } from "@/components/error-boundary";

export default function App() {
  return (
    <Providers>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600">
                  <span className="text-xs font-bold text-white">CM</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">Compliance Monitor</p>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-8">
            <ErrorBoundary>
              <ComplianceMonitor />
            </ErrorBoundary>
          </main>
        </div>
      </TooltipProvider>
    </Providers>
  );
}
