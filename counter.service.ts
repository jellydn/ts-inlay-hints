import type { FastifyInstance } from "fastify";
import S from "fluent-json-schema";

enum CounterAction {
  INCREASE = "increase",
  DECREASE = "decrease"
}

export function counterService(app: FastifyInstance) {
  let counter = 0;
  app.get("/counter", {}, async (_request, _response) => ({ counter }));

  const schema = {
    querystring: S.object().prop(
      "type",
      S.string().enum([CounterAction.DECREASE, CounterAction.INCREASE]).required()
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
      if (request.query.type === CounterAction.INCREASE) {
        counter++;
      } else {
        counter--;
      }

      return { counter };
    }
  );
}
