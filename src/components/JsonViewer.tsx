// src/components/JsonViewer.tsx
import type { Report } from "../@types/pdfJson";

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
  const textMap = Object.fromEntries(data.texts.map((t) => [t.self_ref, t]));
  const tableMap = Object.fromEntries(data.tables.map((t) => [t.self_ref, t]));
  console.log("tableMap : ", tableMap);

  const renderItem = (item: any) => {
    if (item.text) {
      return (
        <div
          key={item.self_ref}
          onMouseEnter={() => onHover(item.self_ref)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onClick(item.self_ref)}
          className={`p-2 border rounded cursor-pointer whitespace-pre-wrap ${
            clickedId === item.self_ref
              ? "bg-yellow-200"
              : hoveredId === item.self_ref
              ? "bg-yellow-100"
              : ""
          }`}
        >
          {item.text}
        </div>
      );
    } else if (item.data?.grid) {
      return (
        <div
          key={item.self_ref}
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
          <table className="table-fixed border-collapse border w-full text-sm">
            <tbody>
              {item.data.grid.map((row: any[], rowIdx: number) => (
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
        </div>
      );
    }
    return null;
  };

  const renderGroup = (group: any) => {
    return (
      <div key={group.self_ref}>
        {group.children.map((ref: any) => {
          const id = ref.$ref;
          console.log("ref.$ref : ", ref.$ref.split("/")[1]);
          // let item;
          // if (ref.$ref.split("/")[1] === "texts") {
          //   item = textMap[id];
          // } else if (ref.$ref.split("/")[1] === "tables") item = tableMap[id];
          // const item = textMap[id] || tableMap[id];
          const item = textMap[id];
          return item ? renderItem(item) : null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {data.body.children.map((ref) => {
        const id = ref.$ref;
        if (id.startsWith("#/groups/")) {
          const idx = parseInt(id.replace("#/groups/", ""), 10);
          const group = data.groups[idx];
          return group ? renderGroup(group) : null;
        } else if (id.startsWith("#/pictures/")) {
          const idx = parseInt(id.replace("#/pictures/", ""), 10);
          const picture = data.pictures[idx];
          return picture ? renderGroup(picture) : null;
        } else if (id.startsWith("#/tables/")) {
          const item = tableMap[id];
          return item ? renderItem(item) : null;
        } else {
          const item = tableMap[id];
          return item ? renderItem(item) : null;
        }
      })}
    </div>
  );
};

export default JsonViewer;
