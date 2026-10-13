export default function EmptyState({ icon = "pi-inbox", title, subtitle, action }) {
  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:px-5 tw:text-center">
      <div className="tw:w-13 tw:h-13 tw:rounded-full tw:bg-[#FFFFFF]-[#F3EEE2] tw:text-[#9AA39B] tw:flex tw:items-center tw:justify-center tw:mb-4">
        <i className={`pi ${icon} tw:text-xl`} />
      </div>
      <div className="font-display tw:text-base tw:mb-1">{title}</div>
      {subtitle && <div className="tw:text-[12.5px] tw:text-[#5E6D67] tw:max-w-xs tw:mb-4">{subtitle}</div>}
      {action}
    </div>
  );
}
