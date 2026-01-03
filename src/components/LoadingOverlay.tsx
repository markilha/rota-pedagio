type LoadingOverlayProps = {
  visible: boolean;
  label?: string;
};

const LoadingOverlay = ({ visible, label }: LoadingOverlayProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[400] grid place-items-center rounded-3xl bg-ink-900/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-full border border-ink-600/60 bg-ink-800/80 px-5 py-3 text-sm uppercase tracking-[0.2em] text-ink-100">
        <span className="h-3 w-3 animate-pulse rounded-full bg-highlight-400" />
        {label ?? "Carregando"}
      </div>
    </div>
  );
};

export default LoadingOverlay;
