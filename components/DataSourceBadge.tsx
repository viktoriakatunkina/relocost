// Строка E-E-A-T: дата обновления данных + источник.
// DATA_UPDATED_DATE менять вручную при следующем обновлении цен.
export const DATA_UPDATED_DATE = "29.06.2026";
export const DATA_SOURCE = "Numbeo";

export function DataSourceBadge({
  updatedLabel,
  sourceLabel,
}: {
  updatedLabel: string; // «Обновлено» / «Updated»
  sourceLabel: string;  // «Источник» / «Source»
}) {
  return (
    <p className="text-muted text-xs flex items-center gap-1.5 mt-2">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="shrink-0 opacity-70"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {updatedLabel} {DATA_UPDATED_DATE} · {sourceLabel}: {DATA_SOURCE}
      </span>
    </p>
  );
}
