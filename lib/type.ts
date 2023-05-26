import { SerializedResponse } from "./swr/response";

export interface MessageToMain {
  pid: number;
  data: {
    req: Request;
  };
}

export interface MessageToSW {
  pid: number;
  data: {
    res: SerializedResponse;
  };
  // data: {
  //   status: MessageStatus;
  //   body: any;
  //   headers?: HeadersInit;
  // };
}
