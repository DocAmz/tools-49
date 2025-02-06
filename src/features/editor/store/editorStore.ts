import * as fabric from 'fabric';
import { makeAutoObservable } from "mobx";

class EditorStore {

  canvas: fabric.Canvas | null = null;
  containerRef: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas: fabric.Canvas | null) {
    this.canvas = canvas;
  }

  setContainerRef(containerRef: HTMLDivElement | null) {
    this.containerRef = containerRef;
  }


}

export const editorStore = new EditorStore();