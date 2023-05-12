export interface MessageToMain {
  pid: number;
  data: {
    req: Request;
  };
}

export interface MessageToSW {
  pid: number;
  data: {
    status: "ok" | "noMatch";
    body: any;
  };
}
