import type { Bbox } from "../@types/pdfJson";

interface OverlayBoxProps {
  bbox: Omit<Bbox, "coord_origin">;
  pageWidth: number;
  hovered?: boolean;
  clicked: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const OverlayBox = ({
  bbox,
  pageWidth,
  hovered,
  clicked,
  onMouseEnter,
  onMouseLeave,
  ref,
}: OverlayBoxProps) => {
  const scale = pageWidth / 595; // PDF 기본 폭
  const style = {
    left: bbox.l * scale,
    top: (842 - bbox.t) * scale,
    width: (bbox.r - bbox.l) * scale,
    height: (bbox.t - bbox.b) * scale,
  };

  return (
    <div
      ref={ref}
      className={`absolute border ${
        clicked
          ? "border-yellow-500 bg-yellow-200/50"
          : hovered
          ? "border-blue-400 bg-blue-200/30"
          : "border-transparent"
      }`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default OverlayBox;
