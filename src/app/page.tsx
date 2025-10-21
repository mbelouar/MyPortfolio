'use client';

import MacOSPortfolio from '@/components/MacOSPortfolio';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="w-full h-screen overflow-hidden">
        <MacOSPortfolio />
      </main>
    </ErrorBoundary>
  );
}
