function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}

export default LoadingSpinner;
