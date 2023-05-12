export class Pipe {
  static _instance: Pipe = new Pipe();

  static single() {
    return Pipe._instance;
  }

  private _id = 1;

  get newid() {
    return this._id++;
  }

  private _pipe: Map<
    number,
    {
      resolve: (value: unknown) => void;
    }
  > = new Map();

  read(pid: number) {
    return new Promise<any>((resolve) => {
      this._pipe.set(pid, {
        resolve,
      });
    });
  }

  write(pid: number, data: any) {
    if (this._pipe.has(pid)) {
      const { resolve } = this._pipe.get(pid)!;
      if (resolve) {
        resolve(data);
      }
      this._pipe.delete(pid);
    }
  }

  size() {
    return this._pipe.size;
  }
}
