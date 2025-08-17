import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { DiagramData } from "./DiagramInlineTool";
import type { API } from "@editorjs/editorjs";
import DiagramList from "../components/DiagramList";

export class DiagramBlockTool {
  private data: DiagramData;
  private wrapper: HTMLElement | null = null;
  private reactRoot: Root | null = null;
  //   private api: API;

  /*
  * Disabled Toolbox configuration for the Diagram Block tool
  static get toolbox() {
    return {
      title: 'Diagram Block',
      icon: '📝'
    };
  }
  */

  constructor({ data }: { data: DiagramData; api: API }) {
    this.data = data || {};
    // this.api = api;
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('diagram-block-wrapper');

    this.renderReactComponent();
    return this.wrapper;
  }

  private renderReactComponent(): void {
    if (!this.wrapper) return;

    this.reactRoot = createRoot(this.wrapper);
    this.reactRoot.render(
      createElement(DiagramList, {
        data: this.data,
      })

    );
  }

  save(): DiagramData {
    return this.data;
  }

  destroy(): void {
    if (this.reactRoot) {
      // this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }
}