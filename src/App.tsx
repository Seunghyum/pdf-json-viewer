import { useState } from "react";
import PdfViewer from "./components/PdfViewer";
import JsonViewer from "./components/JsonViewer";
import data from "../public/1.report.json";
import "./styles.css";
import type { Report } from "./@types/pdfJson";

function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 overflow-auto border-r">
        <PdfViewer
          pdfUrl="./1.report.pdf"
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
        />
      </div>
    </div>
  );
}

export default App;
