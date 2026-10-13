import { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Slider } from 'primereact/slider';
import { PRICE_BOUNDS } from './mockProducts';

/**
 * One collapsible filter group (Categories, Product Tag, Collection, Price, Material, Availability).
 * Kept local to this file since it's purely a layout helper, not shared elsewhere.
 */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="tw:border-b tw:border-stone-200 tw:py-4 tw:first:pt-0 tw:last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tw:flex tw:w-full tw:items-center tw:justify-between tw:text-left tw:text-[13px] tw:font-semibold tw:tracking-wide tw:text-stone-800 tw:focus-visible:outline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-amber-700 tw:rounded tw:capitalize"
      >
        {title}
        <i className={`pi ${open ? 'pi-chevron-up' : 'pi-chevron-down'} tw:text-[11px] tw:text-stone-500`} />
      </button>
      {open && <div className="tw:mt-3 tw:flex tw:flex-col tw:gap-2.5 tw:capitalize">{children}</div>}
    </div>
  );
}

function OptionRow({ id, label, count, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="tw:flex tw:cursor-pointer tw:items-center tw:justify-between tw:gap-2 tw:py-0.5 tw:group"
    >
      <span className="tw:flex tw:items-center tw:gap-2.5">
        <Checkbox inputId={id} checked={checked} onChange={onChange} />
        <span className="tw:text-[14px] tw:text-stone-600 tw:group-hover:text-stone-900">{label}</span>
      </span>
      {typeof count === 'number' && (
        <span className="tw:text-[12px] tw:text-stone-400">({count})</span>
      )}
    </label>
  );
}

const PRICE_PRESETS = [
  { label: 'Under ₹500', range: [PRICE_BOUNDS.min, 500] },
  { label: '₹500 - ₹1,000', range: [500, 1000] },
  { label: '₹1,000 - ₹2,000', range: [1000, 2000] },
  { label: '₹2,000+', range: [2000, PRICE_BOUNDS.max] },
];

/**
 * @param {object} props
 * @param {{name:string,count:number}[]} props.categories
 * @param {{name:string,count:number}[]} props.collections
 * @param {{name:string,count:number}[]} props.materials
 * @param {{value:string,label:string,count:number}[]} props.availability
 * @param {{value:string,label:string,count:number}[]} props.badges
 * @param {{categories:Set,collections:Set,materials:Set,availability:Set,badges:Set,priceRange:[number,number]}} props.selected
 * @param {(group:'categories'|'collections'|'materials'|'availability'|'badges', value:string)=>void} props.onToggle
 * @param {(range:[number,number])=>void} props.onPriceChange
 * @param {()=>void} props.onClearAll
 * @param {number} props.activeCount
 */
export default function FilterSidebar({
  categories,
  collections,
  // materials,
  availability,
  badges,
  selected,
  onToggle,
  onPriceChange,
  onClearAll,
  activeCount,
}) {
  const [min, max] = selected.priceRange;
  const isDefaultRange = min === PRICE_BOUNDS.min && max === PRICE_BOUNDS.max;

  return (
    <div>
      <div className="tw:flex tw:items-center tw:justify-between tw:pb-4">
        <h2 className="tw:text-[13px] tw:font-semibold tw:tracking-wide tw:text-stone-800">Filter by</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="tw:text-[13px] tw:text-stone-400 tw:underline tw:decoration-stone-300 tw:underline-offset-2 tw:hover:text-stone-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Categories">
        {categories.map((c) => (
          <OptionRow
            key={c.name}
            id={`cat-${c.name}`}
            label={c.name}
            count={c.count}
            checked={selected.categories.has(c.name)}
            onChange={() => onToggle('categories', c.name)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Product Tag">
        {badges.map((b) => (
          <OptionRow
            key={b.value}
            id={`badge-${b.value}`}
            label={b.label}
            count={b.count}
            checked={selected.badges.has(b.value)}
            onChange={() => onToggle('badges', b.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Collection">
        {collections.map((c) => (
          <OptionRow
            key={c.name}
            id={`col-${c.name}`}
            label={c.name}
            count={c.count}
            checked={selected.collections.has(c.name)}
            onChange={() => onToggle('collections', c.name)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        <div className="tw:px-1">
          <div className="tw:mb-4 tw:flex tw:items-center tw:justify-between tw:text-[13px] tw:text-stone-700">
            <span>₹{min.toLocaleString('en-IN')}</span>
            <span className="tw:font-medium">
              {isDefaultRange ? 'Any price' : `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`}
            </span>
            <span>₹{max.toLocaleString('en-IN')}{max === PRICE_BOUNDS.max ? '+' : ''}</span>
          </div>
          <Slider
            value={[min, max]}
            onChange={(e) => onPriceChange(e.value)}
            range
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={50}
            className="tw:w-full"
          />
        </div>
        <div className="tw:mt-3 tw:flex tw:flex-col tw:gap-2.5">
          {PRICE_PRESETS.map((preset) => {
            const active = min === preset.range[0] && max === preset.range[1];
            return (
              <label
                key={preset.label}
                className="tw:flex tw:cursor-pointer tw:items-center tw:gap-2.5 tw:py-0.5 tw:group"
              >
                <Checkbox
                  checked={active}
                  onChange={() => onPriceChange(active ? [PRICE_BOUNDS.min, PRICE_BOUNDS.max] : preset.range)}
                />
                <span className="tw:text-[14px] tw:text-stone-600 tw:group-hover:text-stone-900">
                  {preset.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* <FilterSection title="Material">
        {materials.map((m) => (
          <OptionRow
            key={m.name}
            id={`mat-${m.name}`}
            label={m.name}
            count={m.count}
            checked={selected.materials.has(m.name)}
            onChange={() => onToggle('materials', m.name)}
          />
        ))}
      </FilterSection> */}

      <FilterSection title="Availability">
        {availability.map((a) => (
          <OptionRow
            key={a.value}
            id={`avail-${a.value}`}
            label={a.label}
            count={a.count}
            checked={selected.availability.has(a.value)}
            onChange={() => onToggle('availability', a.value)}
          />
        ))}
      </FilterSection>
    </div>
  );
}
