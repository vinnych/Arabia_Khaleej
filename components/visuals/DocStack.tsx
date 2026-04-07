import { FileText } from "lucide-react";

interface Props {
  docs: string[];
  title?: string;
}

export default function DocStack({ docs, title = "Required documents" }: Props) {
  return (
    <div className="bg-surface-low rounded-xl border border-stone-200 p-4">
      <h3 className="text-sm font-semibold text-on-surface mb-3">
        {title}{" "}
        <span className="text-xs font-normal text-gray-500">({docs.length} required)</span>
      </h3>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc} className="flex items-start gap-2 text-xs text-gray-700">
            <FileText size={13} className="text-primary shrink-0 mt-0.5" />
            {doc}
          </li>
        ))}
      </ul>
    </div>
  );
}
