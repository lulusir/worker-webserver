export class WorkerState {
  value: "default" | "ready" | "close" = "default";

  ready() {
    this.value = "ready";
  }

  close() {
    this.value = "close";
  }

  isReady() {
    return this.value === "ready";
  }
}
