'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-sm text-slate-300 mb-8">
          An unexpected error occurred while loading the page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
