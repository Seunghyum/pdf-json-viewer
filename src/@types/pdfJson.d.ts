export interface Report {
  schema_name: string;
  version: string;
  name: string;
  origin: Origin;
  furniture: Body;
  body: Body;
  groups: Body[];
  texts: Text[];
  pictures: Picture[];
  tables: Picture[];
  key_value_items: any[];
  form_items: any[];
  pages: Pages;
}

export interface Body {
  self_ref: string;
  children: Parent[];
  content_layer: ContentLayer;
  name: string;
  label: string;
  parent?: Parent;
}

export interface Parent {
  $ref: string;
}

export enum ContentLayer {
  Body = "body",
  Furniture = "furniture",
}

export interface Origin {
  mimetype: string;
  binary_hash: number;
  filename: string;
}

export interface Pages {
  "1": The1;
}

export interface The1 {
  size: Size;
  image: Image;
  page_no: number;
}

export interface Image {
  mimetype: string;
  dpi: number;
  size: Size;
  uri: string;
}

export interface Size {
  width: number;
  height: number;
}

export interface Picture {
  self_ref: string;
  parent: Parent;
  children: Parent[];
  content_layer: ContentLayer;
  label: string;
  prov: Prov[];
  captions: any[];
  references: any[];
  footnotes: any[];
  image?: Image;
  annotations?: any[];
  data?: Data;
}

export interface Data {
  table_cells: TableCell[];
  num_rows: number;
  num_cols: number;
  grid: Array<TableCell[]>;
}

export interface TableCell {
  bbox: Bbox;
  row_span: number;
  col_span: number;
  start_row_offset_idx: number;
  end_row_offset_idx: number;
  start_col_offset_idx: number;
  end_col_offset_idx: number;
  text: string;
  column_header: boolean;
  row_header: boolean;
  row_section: boolean;
}

export interface Bbox {
  l: number;
  t: number;
  r: number;
  b: number;
  coord_origin: CoordOrigin;
}

export enum CoordOrigin {
  Bottomleft = "BOTTOMLEFT",
  Topleft = "TOPLEFT",
}

export interface Prov {
  page_no: number;
  bbox: Bbox;
  charspan: number[];
}

export interface Text {
  self_ref: string;
  parent: Parent;
  children: any[];
  content_layer: ContentLayer;
  label: Label;
  prov: Prov[];
  orig: string;
  text: string;
  level?: number;
  enumerated?: boolean;
  marker?: Marker;
}

export enum Label {
  ListItem = "list_item",
  PageHeader = "page_header",
  SectionHeader = "section_header",
  Text = "text",
}

export enum Marker {
  Empty = "-",
}
