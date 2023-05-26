import { MessageStatus, MessageToMain, MessageToSW } from "../type";
import { serializeResponse } from "./response";
import { EventType } from "./swEvent";
export class serviceWorkerContainer {
  scriptURL = "/sw.js";

  async start() {
    await this.install();
    await this.notifySwReady();
    this.handlePipeMsg();
    this.handlePageReload();
  }

  async stop() {
    await this.notifySwClose();
    await this.unregister();
  }

  async install() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          this.scriptURL,
          {
            scope: "/",
          }
        );
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    } else {
      throw Error("当前浏览器不支持serviceWorker");
    }
  }

  handlePageReload() {
    window.addEventListener("beforeunload", (e) => {
      this.notifySwClose();
    });
  }

  async notifySwReady() {
    navigator.serviceWorker.ready.then((r) => {
      r.active?.postMessage(EventType.Ready);
    });
    // return this.postMessage(EventType.Ready);
  }

  async notifySwClose() {
    return this.postMessage(EventType.Close);
  }

  getRegistration(): Promise<ServiceWorkerRegistration | undefined> {
    return navigator.serviceWorker.getRegistration(this.scriptURL).then((r) => {
      return r;
    });
  }

  async unregister() {
    const r = await this.getRegistration();
    await r?.unregister();
  }

  private postMessage(msg: any) {
    return this.getRegistration().then((r) => {
      r?.active?.postMessage(msg);
    });
  }

  private msgConsumer: ((data: { req: Request }) => Promise<Response>) | null =
    null;

  setMessageConsumer(
    msgConsumer: (data: { req: Request }) => Promise<Response>
  ) {
    this.msgConsumer = msgConsumer;
  }

  handlePipeMsg() {
    navigator.serviceWorker.addEventListener("message", async (ev) => {
      const v: null | MessageToMain = ev.data;
      if (v?.pid && this.msgConsumer) {
        const { pid, data } = v;
        const request = this.buildRequest(data.req);

        const response = await this.msgConsumer({ req: request });

        if (response) {
          const res: MessageToSW = {
            pid,
            data: {
              res: await serializeResponse(response),
            },
          };
          this.postMessage(res);
        } else {
          const res: MessageToSW = {
            pid,
            data: {
              res: await serializeResponse(new Response(null, { status: 500 })),
            },
          };
          this.postMessage(res);
        }
      }
    });
  }

  buildRequest(data: any) {
    const request = data;

    const serializedRequest = request;
    const headers = new Headers(serializedRequest.headers);
    const newRequest = new Request(serializedRequest.url, {
      method: serializedRequest.method,
      headers: headers,
      referrer: serializedRequest.referrer,
      referrerPolicy: serializedRequest.referrerPolicy,
      mode: serializedRequest.mode,
      credentials: serializedRequest.credentials,
      cache: serializedRequest.cache,
      redirect: serializedRequest.redirect,
      integrity: serializedRequest.integrity,
      keepalive: serializedRequest.keepalive,
    });
    return newRequest;
  }

  getClient() {
    return this.getRegistration().then((r) => {
      return r?.active;
    });
  }
}
