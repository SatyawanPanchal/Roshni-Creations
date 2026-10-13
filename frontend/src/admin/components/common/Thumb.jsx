export default function Thumb({ src, alt = "", size = 38, gold = false }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
        className="tw:rounded-lg tw:object-cover tw:border tw:border-[#E7E0CE]r tw:flex-shrink-0"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={
        "tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:flex-shrink-0 font-display " +
        (gold ? "tw:bg-[#F6EFDC] tw:text-[#AD8A3F]" : "tw:bg-[#E9F1EC] tw:text-[#1F4E47]")
      }
    >
      <i className="pi pi-image tw:text-sm" />
    </div>
  );
}
