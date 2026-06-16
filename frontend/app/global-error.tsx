'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-slate-300">{error?.message || 'An unexpected error occurred.'}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
