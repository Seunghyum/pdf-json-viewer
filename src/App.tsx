import { useState, useRef } from "react";
import PdfViewer from "./components/PdfViewer";
import JsonViewer from "./components/JsonViewer";
import data from "../public/1.report.json";
import "./styles.css";
import type { Report } from "./@types/pdfJson";

import "react-pdf/dist/esm/Page/TextLayer.css";

function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);

  const jsonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <div className="flex h-screen">
      <div className="w-1/2 overflow-auto border-r">
        <PdfViewer
          data={data as Report}
          hoveredId={hoveredId}
          clickedId={clickedId}
          onHover={setHoveredId}
          onClick={setClickedId}
        />
      </div>
      <div className="w-1/2 overflow-auto p-4">
        <JsonViewer
          data={data as Report}
          hoveredId={hoveredId}
          clickedId={clickedId}
          onHover={setHoveredId}
          onClick={setClickedId}
          jsonRefs={jsonRefs}
        />
      </div>
    </div>
  );
}

export default App;
