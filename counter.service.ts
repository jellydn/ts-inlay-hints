import type { FastifyInstance } from "fastify";
import S from "fluent-json-schema";

export function counterService(app: FastifyInstance) {
  let counter = 0;
  app.get("/counter", {}, async (_request, _response) => ({ counter }));

  const schema = {
    querystring: S.object().prop(
      "type",
      S.string().enum(["increase", "decrease"]).required()
    ),
  };
  app.post<{
    Querystring: {
      type: string;
    };
  }>(
    "/counter",
    {
      schema,
    },
    async (request, _reply) => {
      if (request.query.type === "increase") {
        counter++;
      } else {
        counter--;
      }

      return { counter };
    }
  );
}
