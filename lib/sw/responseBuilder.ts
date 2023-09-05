import { deserializeResponse } from "../swr/response";
import { MessageStatus, MessageToSW } from "../type";
import { NoMatchRouteStatusCode } from "../webServer/context";
import { PipeMessage } from "./pipeMessage";

export class ResponseBuilder {
  constructor(
    public pipeMessage: PipeMessage,
    public sw: ServiceWorkerGlobalScope
  ) {}

  async getClient(clientId: string) {
    const clients = this.sw.clients;
    const client = await clients.get(clientId);
    return client;
  }

  async buildResponse(event: FetchEvent) {
    const pid = this.pipeMessage.getNewPid();

    const client = await this.getClient(event.clientId);
    if (client) {
      this.pipeMessage.send(
        pid,
        {
          req: this.serializeRequest(event.request),
        },
        client
      );
    } else {
      console.warn("client not found", event);
    }

    return this.pipeMessage.receive(pid).then((msg: MessageToSW["data"]) => {
      // 处理路由不匹配
      if (msg.res.status === NoMatchRouteStatusCode) {
        return fetch(event.request);
      }

      const response = deserializeResponse(msg.res);
      return response;
    });
  }

  serializeRequest(request: Request) {
    const serializedRequest = {
      url: request.url,
      method: request.method,
      headers: {} as Record<string, any>,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      integrity: request.integrity,
      keepalive: request.keepalive,
    };

    for (const [key, value] of request.headers.entries()) {
      serializedRequest.headers[key] = value;
    }

    return serializedRequest;
  }
}
