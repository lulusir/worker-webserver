import { deserializeResponse } from "../swr/response";

export class Res {
  body: any;

  status: number = 200;

  headers = new Headers();

  _toRes() {
    const headers: Record<string, any> = {};

    for (const [key, value] of this.headers.entries()) {
      headers[key] = value;
    }

    return deserializeResponse({
      body: this.body,
      headers: headers,
      status: this.status,
      statusText: "",
    });
  }
}
