import { Page, Document, pdfjs } from "react-pdf";
import OverlayBox from "./OverlayBox";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useState } from "react";
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
  const pdfUrl = "./1.report.pdf";

  const highlights = data.texts;

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.from(new Array(numPages), (_, index) => (
        <div key={`page_${index + 1}`} className="relative">
          <Page pageNumber={index + 1} width={600} />
          {highlights
            .filter((item) => item.prov[0].page_no === index + 1)
            .map((item, idx: number) => (
              <OverlayBox
                key={idx}
                bbox={item.prov[0].bbox}
                pageWidth={600}
                hovered={hoveredId === item.self_ref}
                clicked={clickedId === item.self_ref}
                onMouseEnter={() => onHover(item.self_ref)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onClick(item.self_ref)}
              />
            ))}
        </div>
      ))}
    </Document>
  );
};

export default PdfViewer;
