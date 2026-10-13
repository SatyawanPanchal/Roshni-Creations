export default function ErrorState({ message = "We couldn't load this data. Please check your connection and try again.", onRetry }) {
  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:px-5 tw:text-center">
      <div className="tw:w-13 tw:h-13 tw:rounded-full tw:bg-[#F3E7E1] tw:text-[#9C4E3A] tw:flex tw:items-center tw:justify-center tw:mb-4">
        <i className="pi pi-exclamation-triangle tw:text-xl" />
      </div>
      <div className="font-display tw:text-base tw:mb-1">Something went wrong</div>
      <div className="tw:text-[12.5px] tw:text-[#5E6D67] tw:max-w-xs tw:mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="tw:flex tw:items-center tw:gap-2 tw:text-[13px] tw:px-4 tw:py-2 tw:rounded-md tw:border tw:border-[#E7E0CE] tw:bg-[#FFFFFF] tw:cursor-pointer"
        >
          <i className="pi pi-refresh tw:text-xs" /> Retry
        </button>
      )}
    </div>
  );
}
