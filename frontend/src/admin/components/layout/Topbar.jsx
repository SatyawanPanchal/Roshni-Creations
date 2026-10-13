export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <div className="tw:h-16 tw:flex-shr[#1C2B28]-0 tw:border-b tw:border-[#E7E0CE] tw:bg-[#FAF7F1] tw:flex tw:items-center tw:justify-between tw:px-4 tw:sm:px-6 tw:sticky tw:top-0 tw:z-20">
      <div className="tw:flex tw:items-center tw:gap-3.5">
        <button
          onClick={onMenuClick}
          className="tw:w-9 tw:h-9 tw:rounded-full tw:border tw:border-[#E7E0CE] tw:bg-[#FFFFFF] tw:flex tw:lg:hidden tw:items-center tw:justify-center tw:cursor-pointer"
        >
          <i className="pi pi-bars tw:text-sm tw:text-[#5E6D67]" />
        </button>
        <div>
          <div className="font-display tw:text-lg tw:sm:text-xl tw:leading-tight">{title}</div>
          {subtitle && <div className="tw:text-[11.5px] tw:text-[#9AA39B] tw:mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="tw:flex tw:items-center tw:gap-3">
        <button className="tw:w-8 tw:h-8 tw:sm:w-9 tw:sm:h-9 tw:rounded-full tw:border tw:border-[#E7E0CE] tw:bg-[#FFFFFF] tw:flex tw:items-center tw:justify-center tw:cursor-pointer tw:text-[#5E6D67]">
          <i className="pi pi-bell tw:text-sm" />
        </button>
      </div>
    </div>
  );
}
