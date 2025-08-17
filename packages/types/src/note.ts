import type { OutputData } from "@editorjs/editorjs";

export interface Note {
  id: string;
  title: string;
  content: OutputData;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectionData {
  text: string;
  range: Range;
  rect: DOMRect;
}