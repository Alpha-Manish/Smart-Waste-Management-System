

interface LoadingStateProps {
  text?: string;
  fullHeight?: boolean;
}

export function LoadingState({ text = 'Loading data...', fullHeight = false }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full ${fullHeight ? 'min-h-[60vh]' : 'py-12'}`}>
      <div className="relative w-12 h-12 mb-4">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">{text}</p>
    </div>
  );
}
