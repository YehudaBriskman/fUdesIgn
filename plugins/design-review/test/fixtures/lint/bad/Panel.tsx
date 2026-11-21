// Lint fixture: every rule here is broken on purpose.
type Props = { rows: any[]; isSaving: boolean; onOpen: (id: string) => void }

export function Panel({ rows, isSaving, onOpen }: Props) {
  const price = rows[0].price as number
  return (
    <div className="transition-all" style={{ color: '#d14' }}>
      <div onClick={() => onOpen('a')}>Open details</div>
      <span>{'$' + price.toFixed(2)}</span>
      <button disabled={isSaving} className="focus:outline-none">Save</button>
    </div>
  )
}
