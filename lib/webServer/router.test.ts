import { Router, Route } from "./router";
import { describe, it, expect, beforeEach, vi } from "vitest";

// describe("Router", () => {
//   describe("constructor", () => {
//     it("should build the trie", () => {
//       const routes = [
//         { path: "/users", handler: () => {}, method: "get" },
//         { path: "/users/:id", handler: () => {}, method: "get" },
//         {
//           path: "/posts/:id/comments/:commentId",
//           handler: () => {},
//           method: "get",
//         },
//       ];
//       const router = new Router(routes);
//       expect(router.match("/users", "get")).toEqual({
//         handler: routes[0].handler,
//         params: {},
//       });
//       expect(router.match("/users/1", "get")).toEqual({
//         handler: routes[1].handler,
//         params: { id: "1" },
//       });
//       expect(router.match("/posts/1/comments/2", "get")).toEqual({
//         handler: routes[2].handler,
//         params: { id: "1", commentId: "2" },
//       });
//     });
//   });

//   describe("add", () => {
//     it("should add a new route and rebuild the trie", () => {
//       const routes = [
//         { path: "/users", handler: () => {}, method: "get" },
//         { path: "/users/:id", handler: () => {}, method: "get" },
//       ];
//       const router = new Router(routes);
//       router.add({ path: "/posts", handler: () => {}, method: "get" });
//       expect(router.match("/posts", "get")).toEqual({
//         handler: expect.any(Function),
//         params: {},
//       });
//     });
//   });

//   describe("match", () => {
//     it("should return the handler and params for a matching path", () => {
//       const routes = [
//         { path: "/users", handler: () => {}, method: "get" },
//         { path: "/users/:id", handler: () => {}, method: "get" },
//         {
//           path: "/posts/:id/comments/:commentId",
//           handler: () => {},
//           method: "get",
//         },
//       ];
//       const router = new Router(routes);
//       expect(router.match("/users", "get")).toEqual({
//         handler: routes[0].handler,
//         params: {},
//       });
//       expect(router.match("/users/1", "get")).toEqual({
//         handler: routes[1].handler,
//         params: { id: "1" },
//       });
//       expect(router.match("/posts/1/comments/2", "get")).toEqual({
//         handler: routes[2].handler,
//         params: { id: "1", commentId: "2" },
//       });
//     });

//     it("should return null handler and empty params for a non-matching path", () => {
//       const routes = [{ path: "/users", handler: () => {}, method: "get" }];
//       const router = new Router(routes);
//       expect(router.match("/posts", "get")).toEqual({
//         handler: null,
//         params: {},
//       });
//     });
//   });
// });

describe("Router2", () => {
  let router: Router;

  beforeEach(() => {
    router = new Router([]);
  });

  // it("should match nested paths", () => {
  //   const route1: Route = { path: "/users", handler: vi.fn(), method: "get" };
  //   const route2: Route = {
  //     path: "/users/:id",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   router.add(route1);
  //   router.add(route2);

  //   expect(router.match("/users", "get").handler).toBe(route1.handler);
  //   expect(router.match("/users/123", "get").handler).toBe(route2.handler);
  // });

  // it("should handle multiple params in a single path", () => {
  //   const route: Route = {
  //     path: "/users/:userId/posts/:postId",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   router.add(route);

  //   const { params } = router.match("/users/123/posts/456", "get");
  //   expect(params).toEqual({ userId: "123", postId: "456" });
  // });

  // it("should handle optional segments in a path", () => {
  //   const route: Route = {
  //     path: "/users/:id/posts/:postId?",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   router.add(route);

  //   expect(router.match("/users/123/posts", "get").handler).toBe(route.handler);
  //   expect(router.match("/users/123/posts/456", "get").handler).toBe(
  //     route.handler
  //   );
  // });

  // it("should handle complex path patterns", () => {
  //   const route1: Route = { path: "/users", handler: vi.fn(), method: "get" };
  //   const route2: Route = {
  //     path: "/users/:id",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   const route3: Route = {
  //     path: "/users/:id/posts",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   const route4: Route = {
  //     path: "/users/:id/posts/:postId",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   const route5: Route = {
  //     path: "/posts/:postId",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   router.add(route1);
  //   router.add(route2);
  //   router.add(route3);
  //   router.add(route4);
  //   router.add(route5);

  //   expect(router.match("/users", "get").handler).toBe(route1.handler);
  //   expect(router.match("/users/123", "get").handler).toBe(route2.handler);
  //   expect(router.match("/users/123/posts", "get").handler).toBe(
  //     route3.handler
  //   );
  //   expect(router.match("/users/123/posts/456", "get").handler).toBe(
  //     route4.handler
  //   );
  //   expect(router.match("/posts/789", "get").handler).toBe(route5.handler);
  // });

  // it("should handle complex path patterns, test priority", () => {
  //   const route1: Route = { path: "/users", handler: vi.fn(), method: "get" };
  //   const route2: Route = {
  //     path: "/users/:id",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   const route3: Route = { path: "/users/a", handler: vi.fn(), method: "get" };
  //   const route4: Route = {
  //     path: "/users/a/{b}",
  //     handler: vi.fn(),
  //     method: "get",
  //   };
  //   const route5: Route = {
  //     path: "/users/a/b",
  //     handler: vi.fn(),
  //     method: "get",
  //   };

  //   router.add(route1);
  //   router.add(route2);
  //   router.add(route3);
  //   router.add(route4);
  //   router.add(route5);

  //   expect(router.match("/users", "get").handler).toBe(route1.handler);
  //   expect(router.match("/users/1", "get").handler).toBe(route2.handler);
  //   expect(router.match("/users/a", "get").handler).toBe(route3.handler);
  //   expect(router.match("/users/a/1", "get").handler).toBe(route4.handler);
  //   expect(router.match("/users/a/b", "get").handler).toBe(route5.handler);
  // });

  it("should handle wildcard params in a path", () => {
    const route: Route = {
      path: "/users/:userId/*",
      handler: vi.fn(),
      method: "get",
    };
    router.add(route);

    const { params, handler } = router.match("/users/123/posts/456", "get");
    expect(handler).toBe(route.handler);

    expect(params).toEqual({ userId: "123" });
  });

  it("should handle  params in a path", () => {
    const route: Route = {
      path: "/users/:id1",
      handler: vi.fn(),
      method: "get",
    };

    const route1: Route = {
      path: "/users2/{id2}",
      handler: vi.fn(),
      method: "get",
    };

    const route2: Route = {
      path: "/users/:id1/{id2}",
      handler: vi.fn(),
      method: "get",
    };
    router.add(route);
    router.add(route1);
    router.add(route2);

    (() => {
      const { params, handler } = router.match("/users/123", "get");
      expect(handler).toBe(route.handler);
      expect(params).toEqual({ id1: "123" });
    })();

    (() => {
      const { params, handler } = router.match("/users2/123", "get");
      expect(handler).toBe(route1.handler);
      expect(params).toEqual({ id2: "123" });
    })();

    (() => {
      const { params, handler } = router.match("/users/123/456", "get");
      expect(handler).toBe(route2.handler);
      expect(params).toEqual({ id1: "123", id2: "456" });
    })();
  });
});
