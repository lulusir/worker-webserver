// 自动生成的route
import { z } from "zod";
import { Route } from "../dist";
import { generateMock } from "@anatine/zod-mock";

const handler: Route["handler"] = async (params) => {
  const s = z.object({
    code: z.number(),
    message: z.string(),
    result: z.object({
      records: z.array(
        z.object({
          id: z.number(),
          taskId: z.number(),
          taskTypeCode: z.string(),
          taskTypeName: z.string(),
          businessTypeCode: z.string(),
          businessTypeName: z.string(),
          onewoCode: z.string(),
          onewoName: z.null(),
          projectCode: z.null(),
          projectName: z.null(),
          zhanquCode: z.null(),
          zhanquName: z.string(),
          cityCode: z.null(),
          cityName: z.string(),
          streetCode: z.null(),
          taskStatus: z.string(),
          pushStatus: z
            .string()
            .describe(
              '    WAIT("待推送"),\n    PUSHING("推送中"),\n    SUCCESS("推送成功"),\n    FAIL("推送失败");'
            ),
          pushTime: z.number(),
          checkStatus: z.string().describe("抽检结果"),
          checkTime: z.string().describe("抽检时间"),
          taskCreateTime: z.string().describe("任务创建时间"),
          checkForm: z.string().describe("抽检方"),
        })
      ),
      total: z.number(),
      size: z.number(),
      current: z.number(),
      pages: z.number(),
    }),
  });
  const mockData = generateMock(s);
  // todo 判断接口为json的时候要转
  return JSON.stringify(mockData);
};

export const apiRoutes: Route[] = [
  { path: "/users", handler: handler, method: "GET" },
  { path: "/users/:id", handler: handler, method: "get" },
  { path: "/users/:id", handler: handler, method: "POST" },
  { path: "/posts/:id/comments/:commentId", handler: handler, method: "GET" },
];