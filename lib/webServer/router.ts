import { Res } from "./res";

export type Params = Record<string, string>;

export type RouterContext = {
  params: Params;
  req: Request;
  res: Res;
};

enum Priority {
  wildcard = 0, // 通配符
  param = 1, // 参数
  static = 2, // 全匹配的字符串
}

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isParam: boolean = false;
  paramName: string = "";
  handler: Route["handler"] = null;
  isEnd = false;
  priority = Priority.static; // 越大优先级越高, * < :id
  isOptionl = false;
  method: Route["method"] = "GET";
}

export interface Route {
  method: Request["method"]; // UpperCase
  path: string;
  handler: ((context: RouterContext) => any | Promise<any>) | null;
}

export class Router {
  private root: TrieNode = new TrieNode();

  constructor(routes?: Route[]) {
    if (routes) {
      this.addRoutes(routes);
    }
  }

  public add(route: Route): void {
    this._insert(route);
  }

  private isPrams(segment: string) {
    const paramsReg = /\{([^}]+)\}/g;
    return segment.startsWith(":") || paramsReg.test(segment);
  }

  private paramName(segment: string) {
    const paramsReg = /\{([^}]+)\}/g;
    if (segment.startsWith(":")) {
      return segment.slice(1);
    }
    if (paramsReg.test(segment)) {
      return segment.slice(1, -1) || "";
    }
    return "";
  }

  private _insert(route: Route) {
    const method = route.method.toUpperCase();
    const segments = [method, ...route.path.split("/")];
    let node = this.root;
    for (const segment of segments) {
      if (segment === "") continue;

      const isParam = this.isPrams(segment);
      const isOptionl = isParam && segment.endsWith("?");
      const key = isParam ? "*" : segment;
      if (!node.children.has(key)) {
        const n = new TrieNode();
        n.isParam = isParam;
        n.paramName = isParam ? this.paramName(segment) : ""; // /:id -> id
        n.isOptionl = isOptionl;
        if (isParam) {
          n.priority = Priority.param;
        } else {
          if (key === "*") {
            n.priority = Priority.wildcard;
          }
        }
        node.children.set(key, n);
      }
      node = node.children.get(key)!;
    }
    node.method = method;
    node.handler = route.handler;
    node.isEnd = true;
  }

  public addRoutes(routes: Route[]): void {
    for (const route of routes) {
      this._insert(route);
    }
  }

  public match(
    path: string,
    method: Route["method"]
  ): {
    handler: Route["handler"];
    params: Params;
  } {
    const segments = [method.toUpperCase(), ...path.split("/")];
    const params: Params = {};
    let node: TrieNode = this.root;

    for (const segment of segments) {
      if (segment === "") continue;
      let found = false;

      for (const [key, child] of node.children) {
        if (key === segment) {
          node = child;
          found = true;
          break;
        }
        if (child.isParam) {
          params[child.paramName] = segment;
          node = child;
          found = true;
          break;
        }

        if (key === "*") {
          if (child.isEnd) {
            return { handler: child.handler, params };
          }
        }
      }
      if (!found) {
        return { handler: null, params: {} };
      }
    }

    for (const [key, child] of node.children) {
      if (child.isParam) {
        if (child.isOptionl) {
          node = child;
          break;
        }
      }
    }

    return {
      handler: node ? node.handler : null,
      params,
    };
  }
}
