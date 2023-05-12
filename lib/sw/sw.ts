import { EventType } from "../swr/swEvent";
import { PipeMessage } from "./pipeMessage";
import { ResponseBuilder } from "./responseBuilder";
import { Pipe } from "./pipe";
import { isHttpUrl } from "./utils";
import { WorkerState } from "./workerState";

const sw = self as unknown as ServiceWorkerGlobalScope;

const workerState = new WorkerState();
const pipe = Pipe.single();
const pipeMessage = new PipeMessage(pipe);
const responseBuilder = new ResponseBuilder(pipeMessage, sw);

sw.addEventListener("install", function () {
  // 强制等待 service worker 成为激活的 service worker。
  sw.skipWaiting();
});

sw.addEventListener("activate", function (event) {
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener("message", (ev) => {
  if (ev.data === EventType.Ready) {
    workerState.ready();
    return;
  }

  if (ev.data === EventType.Close) {
    workerState.close();
    return;
  }

  // write pipe message
  if (ev.data?.pid) {
    const { pid } = ev.data;
    pipeMessage.consume(pid, ev.data);
    return;
  }
});

sw.addEventListener("fetch", (event) => {
  if (!workerState.isReady()) {
    return;
  }

  const { request } = event;
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/event-stream")) {
    return;
  }
  if (request.mode === "navigate") {
    return;
  }
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
    return;
  }

  if (!isHttpUrl(request.url)) {
    return;
  }

  event.respondWith(responseBuilder.buildResponse(event));
});
