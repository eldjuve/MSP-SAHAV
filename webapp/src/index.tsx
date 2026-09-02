import { ErrorBoundary } from 'solid-js';
import { render } from 'solid-js/web';
import './index.css';
import { App } from './App';

function ErrorFallback(err: unknown, reset: () => void) {
  console.error(err);
  return (
    <div class="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
      <p class="text-lg font-semibold text-gray-800">Something went wrong.</p>
      <p class="text-sm text-gray-500 max-w-md">
        {err instanceof Error ? err.message : String(err)}
      </p>
      <button
        class="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}

render(
  () => (
    <ErrorBoundary fallback={ErrorFallback}>
      <App />
    </ErrorBoundary>
  ),
  document.getElementById('root')!,
);
