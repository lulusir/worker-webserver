import { App, Server } from "./app";
import { EventType } from "./swEvent";
import { MessageToMain, MessageToSW } from "../type";
export class serviceWorkerContainer {
  constructor(public workerApp: Server) {}

  scriptURL = "/sw.js";

  async start() {
    await this.install();
    await this.notifySwReady();
    this.handlePipeMsg();
    this.handlePageReload();
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
    r?.unregister().then((v) => {
      console.log("unregister", v);
    });
  }

  private postMessage(msg: any) {
    return this.getRegistration().then((r) => {
      r?.active?.postMessage(msg);
    });
  }

  handlePipeMsg() {
    navigator.serviceWorker.addEventListener("message", async (ev) => {
      const v: null | MessageToMain = ev.data;
      if (v?.pid) {
        const { pid, data } = v;
        const request = this.buildRequest(data.req);

        const body = await this.workerApp.msgConsumer({ req: request });

        if (body) {
          const res: MessageToSW = {
            pid,
            data: {
              status: "ok",
              body: body,
            },
          };
          this.postMessage(res);
        } else {
          const res: MessageToSW = {
            pid,
            data: {
              status: "noMatch",
              body: null,
            },
          };
          this.postMessage(res);
        }
      }
    });
  }

  buildRequest(data: any) {
    // 获取传递的消息
    const request = data;

    // 将请求转换为 Request 对象
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
