import { Pipe } from "./pipe";

export interface PipeMessagePayload<T = any> {
  pid: number;
  data: T;
}

export class PipeMessage {
  constructor(public pipe: Pipe) {}

  getNewPid() {
    return this.pipe.newid;
  }

  consume(pid: number, data: any) {
    this.pipe.write(pid, data);
  }

  /**
   * wrap pid
   * send msg to main
   */
  async send<T>(pid: number, msg: T, client?: Client) {
    if (client) {
      const payload: PipeMessagePayload<T> = {
        pid,
        data: msg,
      };
      client.postMessage(payload);
    }
  }

  /**
   * receive msg from main
   */
  async receive(pid: number): Promise<any> {
    return this.pipe.read(pid).then((res: PipeMessagePayload) => {
      return res.data;
    });
  }
}
