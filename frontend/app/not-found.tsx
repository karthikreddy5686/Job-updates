export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Page not found
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          The page you are looking for does not exist.
        </p>
        <a href="/"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  )
}
