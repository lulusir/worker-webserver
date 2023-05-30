// 自动生成的route
import { z } from "zod";
import { Route } from "../dist";
import { generateMock } from "@anatine/zod-mock";

const handler: Route["handler"] = async (ctx) => {
  console.log(ctx);
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

  ctx.res.body = JSON.stringify(mockData);
  ctx.res.headers.set("content-type", "application/json");
};

export const apiRoutes: Route[] = [
  {
    path: "/ftc/admin/task/setting/page",
    method: "get",
    handler: async (ctx) => {
      const s = z.object({
        code: z.number().int().describe("状态码。0为成功"),
        message: z.string().describe("描述信息"),
        result: z.object({
          records: z
            .array(
              z.object({
                taskName: z.string().describe("任务名称"),
                taskCode: z.string().describe("任务编码"),
                taskSettingType: z
                  .string()
                  .describe(
                    "     * 0、作业任务      * 1、验收任务      * 2、质检任务"
                  ),
                businessTypeCode: z.string().describe("业务类型编码"),
                businessTypeName: z.string(),
                taskTypeCode: z.string().describe("任务类型编码"),
                taskTypeName: z.string(),
                status: z.string().describe("0 编辑 1 发布 2 删除"),
                abilityName: z.string().describe("能力标签"),
                id: z.string(),
              })
            )
            .optional(),
          current: z.number().optional(),
          pages: z.number().optional(),
          total: z.number().optional(),
          size: z.number().optional(),
        }),
      });

      const mockData = generateMock(s);

      ctx.res.headers.set("content-type", "application/json");

      ctx.res.body = JSON.stringify(mockData);
    },
  },

  { path: "/users", handler: handler, method: "GET" },
  { path: "/users/:id", handler: handler, method: "get" },
  { path: "/test/{packCode}/{abc}", handler: handler, method: "get" },
  { path: "/users/:id", handler: handler, method: "POST" },
  { path: "/posts/:id/comments/:commentId", handler: handler, method: "GET" },
];
