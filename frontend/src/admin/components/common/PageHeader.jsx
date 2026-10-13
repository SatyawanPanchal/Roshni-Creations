export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-5">
      <div>
        <div className="font-display tw:text-xl tw:sm:text-2xl">{title}</div>
        {subtitle && <div className="tw:text-[13px] tw:text-[#5E6D67] tw:mt-1">{subtitle}</div>}
      </div>
      {actions && <div className="tw:flex tw:gap-2.5 tw:flex-wrap">{actions}</div>}
    </div>
  );
}
