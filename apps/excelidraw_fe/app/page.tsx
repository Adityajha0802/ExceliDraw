import { Button } from '@repo/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Welcome to the future
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white">
          Start Your Journey Today
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Join thousands of users who have already transformed their experience with our platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            
            className="cursor-pointer text-lg p-4 rounded-full shadow-lg hover:shadow-lg transition-all border-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-blue-800 dark:hover:text-white"
          >
            Sign Up
          </Button>

          <Button
            className="cursor-pointer text-lg p-4 rounded-full shadow-lg hover:shadow-lg transition-all  border-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-blue-800 dark:hover:text-white"
          >
            Sign In
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-8 text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reliable</span>
          </div>
        </div>
      </main>
    </div>
  );
}


