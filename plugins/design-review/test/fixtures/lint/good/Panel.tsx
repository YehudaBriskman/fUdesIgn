// Lint fixture: the fixed counterpart of bad/Panel.tsx.
type Row = { id: string; price: number }
type Props = { rows: Row[]; isSaving: boolean; onOpen: (id: string) => void }

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function Panel({ rows, isSaving, onOpen }: Props) {
  const price = rows[0]?.price ?? 0
  return (
    <div className="transition-colors" style={{ color: 'var(--danger)' }}>
      <button type="button" onClick={() => onOpen('a')}>Open details</button>
      <span>{money.format(price)}</span>
      <button aria-disabled={isSaving} aria-busy={isSaving} className="focus-visible:outline-2">Save</button>
    </div>
  )
}
