import Link from "next/link";

interface ArchiveWidgetProps {
  archiveData: { [year: string]: string[] };
}

export function ArchiveWidget({ archiveData }: ArchiveWidgetProps) {
  // Filter out years with empty months arrays
  const filteredArchiveData = Object.fromEntries(
    Object.entries(archiveData).filter(([_, months]) => months.length > 0)
  );

  // Get years in descending order
  const sortedYears = Object.keys(filteredArchiveData).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h3 className="text-xl font-semibold mb-4 text-primary">Agenda</h3>

      {sortedYears.length > 0 ? (
        <div>
          {sortedYears.map((year) => (
            <div key={year} className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800">{year}</h4>
              <ul className="mt-2 space-y-1">
                {filteredArchiveData[year].map((month) => (
                  <li key={`${year}-${month}`} className="ml-4">
                    <Link
                      href={`/blog?year=${year}&month=${month}`}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {month}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Geen archieven beschikbaar</p>
      )}
    </div>
  );
}
