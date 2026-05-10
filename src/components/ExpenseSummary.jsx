const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

function SummaryCard({ title, rows }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs text-gray-500">No expenses</p>
      ) : (
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {rows.map(([label, amt]) => (
              <tr key={label}>
                <td className="py-1 pr-2">{label}</td>
                <td className="py-1 text-right font-medium tabular-nums">{fmt(amt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function ExpenseSummary({ summary }) {
  if (!summary) return null;

  const catRows = Object.entries(summary.totalByCategory);
  const payerRows = Object.entries(summary.totalByPayer);
  const currencyRows = Object.entries(summary.currencyTotals);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard title="By Category" rows={catRows} />
      <SummaryCard title="By Payer" rows={payerRows} />
      <SummaryCard title="Totals by Currency" rows={currencyRows} />
    </div>
  );
}
