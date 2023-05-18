export interface MessageToMain {
  pid: number;
  data: {
    req: Request;
  };
}

export interface MessageToSW {
  pid: number;
  data: {
    status: MessageStatus;
    body: any;
  };
}

export enum MessageStatus {
  ok,
  noMatch,
}
