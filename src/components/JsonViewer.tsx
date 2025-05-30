import { type JSX } from "react";
import type { Report, Table } from "../@types/pdfJson";
import useScrollTo from "../hooks/useScrollTo";

interface JsonViewerProps {
  data: Report;
  hoveredId: string | null;
  clickedId: string | null;
  onClick: (id: string) => void;
}

const JsonViewer = ({
  data,
  hoveredId,
  clickedId,
  onClick,
}: JsonViewerProps) => {
  const jsonRefs = useScrollTo(hoveredId);

  const textMap = Object.fromEntries(data.texts.map((t) => [t.self_ref, t]));
  const tableMap = Object.fromEntries(data.tables.map((t) => [t.self_ref, t]));

  const renderTable = (item: Table) => {
    const occupied = new Set(); // 실제 렌더링 위치 추적
    const renderedKeys = new Set(); // 중복 셀 제거용 키: `${start_row_offset_idx},${start_col_offset_idx}`

    const generateTable = () => {
      return item.data.grid.map((row, rowIdx) => {
        const tr = [];
        let colIdx = 0;

        for (const cell of row) {
          const cellKey = `${cell.start_row_offset_idx},${cell.start_col_offset_idx}`;

          // 중복 셀 제거: 이미 렌더링된 위치면 건너뜀
          if (renderedKeys.has(cellKey)) {
            continue;
          }
          renderedKeys.add(cellKey);

          // 렌더링 좌표 탐색: occupied 여부 확인
          while (occupied.has(`${rowIdx},${colIdx}`)) {
            colIdx++;
          }

          const rowSpan = cell.row_span || 1;
          const colSpan = cell.col_span || 1;

          // 병합 셀 영역 마킹
          for (let r = 0; r < rowSpan; r++) {
            for (let c = 0; c < colSpan; c++) {
              occupied.add(`${rowIdx + r},${colIdx + c}`);
            }
          }

          tr.push(
            cell.column_header || cell.row_header ? (
              <th
                className="border px-2 py-1"
                key={`${rowIdx}-${colIdx}`}
                rowSpan={rowSpan}
                colSpan={colSpan}
              >
                {cell.text}
              </th>
            ) : (
              <td
                className="border px-2 py-1"
                key={`${rowIdx}-${colIdx}`}
                rowSpan={rowSpan}
                colSpan={colSpan}
              >
                {cell.text}
              </td>
            )
          );

          colIdx += colSpan;
        }

        return <tr key={rowIdx}>{tr}</tr>;
      });
    };

    return (
      <table className="table-fixed border-collapse border w-full text-sm">
        <tbody>{generateTable()}</tbody>
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
          renderTarget = (
            <pre>
              {data.groups[idx].children
                .map((c) => textMap[c.$ref].text)
                .join("\n")}
            </pre>
          );
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
          if (item.label === "page_header") {
            renderTarget = <h1 className="text-2xl font-bold">{item.text}</h1>;
          } else if (item.label === "section_header") {
            renderTarget = <h4 className="text-xl font-bold">{item.text}</h4>;
          } else if (item.label === "text") {
            renderTarget = <p className="text-xs">{item.text}</p>;
          } else {
            renderTarget = item.text;
          }
        }

        return (
          <div
            key={item.self_ref}
            ref={(el) => {
              jsonRefs.current[item.self_ref] = el;
            }}
            onClick={() => onClick(item.self_ref)}
            className={`border p-2 rounded cursor-pointer overflow-auto ${
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
