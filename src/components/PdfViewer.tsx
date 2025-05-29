import { Page, Document, pdfjs } from "react-pdf";
import OverlayBox from "./OverlayBox";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useEffect, useRef, useState } from "react";
import type { Report } from "../@types/pdfJson";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  data: Report;
  hoveredId: string | null;
  clickedId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const PdfViewer = ({
  data,
  hoveredId,
  clickedId,
  onHover,
  onClick,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const pdfRef = useRef<Record<string, HTMLDivElement | null>>({});
  const pdfUrl = "./1.report.pdf";

  useEffect(() => {
    if (clickedId && pdfRef.current[clickedId]) {
      pdfRef.current[clickedId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [clickedId]);

  const textMap = Object.fromEntries(data.texts.map((t) => [t.self_ref, t]));
  const tableMap = Object.fromEntries(data.tables.map((t) => [t.self_ref, t]));
  const picturesMap = Object.fromEntries(
    data.pictures.map((t) => [t.self_ref, t])
  );
  const groupsMap = Object.fromEntries(data.groups.map((t) => [t.self_ref, t]));

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.from(new Array(numPages), (_, index) => (
        <div key={`page_${index + 1}`} className="relative">
          <Page
            renderAnnotationLayer={false}
            renderTextLayer={false}
            pageNumber={index + 1}
            width={600}
          />

          {data.body.children.map((ref) => {
            const id = ref.$ref;
            let item;
            if (id.startsWith("#/groups/")) {
              const first = groupsMap[id].children[0];
              const last =
                groupsMap[id].children[groupsMap[id].children.length - 1];
              const maxWidth = Math.max(
                ...groupsMap[id].children.map(
                  (c) => textMap[c.$ref].prov[0].bbox.r
                )
              );
              return (
                <OverlayBox
                  ref={(el) => {
                    pdfRef.current[first.$ref] = el;
                  }}
                  key={index}
                  bbox={{
                    l: textMap[first.$ref].prov[0].bbox.l,
                    r: maxWidth,
                    t: textMap[first.$ref].prov[0].bbox.t,
                    b: textMap[last.$ref].prov[0].bbox.b,
                  }}
                  pageWidth={600}
                  hovered={hoveredId === first.$ref}
                  clicked={clickedId === first.$ref}
                  onMouseEnter={() => onHover(first.$ref)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onClick(first.$ref)}
                />
              );
            } else if (id.startsWith("#/tables/")) {
              item = tableMap[id];
            } else if (id.startsWith("#/pictures/")) {
              item = picturesMap[id];
            } else {
              item = textMap[id];
            }
            return (
              <OverlayBox
                ref={(el) => {
                  pdfRef.current[item.self_ref] = el;
                }}
                key={item.self_ref}
                bbox={item.prov?.[0]?.bbox}
                pageWidth={600}
                hovered={hoveredId === item.self_ref}
                clicked={clickedId === item.self_ref}
                onMouseEnter={() => onHover(item.self_ref)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onClick(item.self_ref)}
              />
            );
          })}
        </div>
      ))}
    </Document>
  );
};

export default PdfViewer;
