import { useEffect, useRef, type JSX } from "react";
import type { Report, Table } from "../@types/pdfJson";

interface JsonViewerProps {
  data: Report;
  hoveredId: string | null;
  clickedId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const JsonViewer = ({
  data,
  hoveredId,
  clickedId,
  onHover,
  onClick,
}: JsonViewerProps) => {
  const jsonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (clickedId && jsonRefs.current[clickedId]) {
      jsonRefs.current[clickedId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [clickedId, jsonRefs]);

  const textMap = Object.fromEntries(data.texts.map((t) => [t.self_ref, t]));
  const tableMap = Object.fromEntries(data.tables.map((t) => [t.self_ref, t]));

  const renderTable = (item: Table) => {
    return (
      <table className="table-fixed border-collapse border w-full text-sm">
        <tbody>
          {item.data.grid.map((row, rowIdx: number) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) =>
                cell.column_header || cell.row_header ? (
                  <th
                    key={colIdx}
                    colSpan={cell.col_span}
                    rowSpan={cell.row_span}
                    className="border px-2 py-1"
                  >
                    {cell.text}
                  </th>
                ) : (
                  <td
                    key={colIdx}
                    colSpan={cell.col_span}
                    rowSpan={cell.row_span}
                    className="border px-2 py-1"
                  >
                    {cell.text}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-8">
      {data.body.children.map((ref) => {
        const id = ref.$ref;
        let item;
        let renderTarget: JSX.Element | string;
        if (id.startsWith("#/groups/")) {
          const idx = parseInt(id.replace("#/groups/", ""), 10);
          renderTarget = data.groups[idx].children
            .map((c) => textMap[c.$ref].text)
            .join("\n");
          item = textMap[data.groups[idx].children[0].$ref];
        } else if (id.startsWith("#/pictures/")) {
          const idx = parseInt(id.replace("#/pictures/", ""), 10);
          item = data.pictures[idx];
          renderTarget = <img src={item.image?.uri} />;
        } else if (id.startsWith("#/tables/")) {
          item = tableMap[id];
          renderTarget = renderTable(item);
        } else {
          item = textMap[id];
          renderTarget = item.text;
        }

        return (
          <div
            key={item.self_ref}
            ref={(el) => {
              jsonRefs.current[item.self_ref] = el;
            }}
            onMouseEnter={() => onHover(item.self_ref)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(item.self_ref)}
            className={`border p-2 rounded overflow-auto ${
              clickedId === item.self_ref
                ? "bg-yellow-200"
                : hoveredId === item.self_ref
                ? "bg-yellow-100"
                : ""
            }`}
          >
            {renderTarget}
          </div>
        );
      })}
    </div>
  );
};

export default JsonViewer;
