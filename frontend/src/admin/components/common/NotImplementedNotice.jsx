// Shown inline on a page/form when it depends on a backend route that
// doesn't exist yet. Keeps the UI honest instead of faking a success state.
export default function NotImplementedNotice({ error }) {
  if (!error) return null;
  return (
    <div className="tw:flex tw:items-start tw:gap-3 tw:bg-[#F6EFDC] tw:border tw:border-[#AD8A3F] tw:text-[13px] tw:text-[#1C2B28] tw:rounded-lg tw:p-4 tw:mb-4">
      <i className="pi pi-wrench tw:text-[#AD8A3F] tw:mt-0.5" />
      <div>
        <div className="tw:font-medium tw:mb-1">This action needs a backend endpoint</div>
        <div className="tw:text-[#5E6D67] tw:mb-1">
          <span className="mono">{error.method} {error.path}</span> isn't implemented on the server yet.
        </div>
        {error.contract && <div className="tw:text-[12px] tw:text-[#9AA39B]">{error.contract}</div>}
      </div>
    </div>
  );
}
