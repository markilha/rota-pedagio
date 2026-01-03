type StatsCardProps = {
  title: string;
  value: string;
  accentClassName?: string;
  helper?: string;
};

const StatsCard = ({
  title,
  value,
  accentClassName,
  helper,
}: StatsCardProps) => {
  return (
    <div className="rounded-2xl border border-ink-700/50 bg-ink-900/40 p-1">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{title}</p>
      <p
        className={`mt-2 text-lg font-display ${
          accentClassName ?? "text-ink-100"
        }`}
      >
        {value}
      </p>
      {helper ? <p className="mt-2 text-xs text-ink-300">{helper}</p> : null}
    </div>
  );
};

export default StatsCard;
