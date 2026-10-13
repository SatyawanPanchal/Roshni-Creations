/**
 * Admin top bar – "Product details / Full listing information" + bell + avatar.
 * Put this in your AdminLayout (above the <Outlet />) and feed title/subtitle per route.
 * If your layout already renders a top bar, only copy the classes you need.
 */
export default function PageTopbar({
  title,
  subtitle,
  initials = "RA",
  hasNotifications = true,
  onBellClick,
}) {
  return (
    <header className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:sm:gap-4 tw:px-4 tw:py-3 tw:sm:px-[19px] tw:sm:py-3.5 tw:border-b tw:border-[#E7E0CE] tw:bg-[#FAF6EF]">
      <div className="tw:min-w-0">
        <h1 className="font-display tw:text-[19px] tw:sm:text-[23px] tw:leading-tight tw:m-0 tw:text-[#1C2B28] tw:truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="tw:m-0 tw:mt-0.5 tw:text-[12.5px] tw:sm:text-[13.5px] tw:text-[#9AA39E] tw:truncate">{subtitle}</p>
        )}
      </div>

      <div className="tw:flex tw:items-center tw:gap-2.5 tw:sm:gap-3 tw:shrink-0">
        <button
          type="button"
          onClick={onBellClick}
          aria-label="Notifications"
          className="tw:relative tw:w-[38px] tw:h-[38px] tw:sm:w-[43px] tw:sm:h-[43px] tw:rounded-full tw:bg-white tw:border tw:border-[#E7E0CE] tw:flex tw:items-center tw:justify-center tw:cursor-pointer"
        >
          <i className="pi pi-bell tw:text-[14px] tw:sm:text-[15px] tw:text-[#1C2B28]" />
          {hasNotifications && (
            <span className="tw:absolute tw:top-1.5 tw:right-[9px] tw:sm:top-2 tw:sm:right-[11px] tw:w-2 tw:h-2 tw:rounded-full tw:bg-[#B8924F]" />
          )}
        </button>

        <div className="tw:w-[34px] tw:h-[34px] tw:sm:w-[38px] tw:sm:h-[38px] tw:rounded-full tw:bg-[#E3EEE8] tw:text-[#1E4D45] tw:text-[11.5px] tw:sm:text-[12.5px] tw:font-semibold tw:flex tw:items-center tw:justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
}

/* Usage in AdminLayout:
   <PageTopbar title="Product details" subtitle="Full listing information" />
*/
