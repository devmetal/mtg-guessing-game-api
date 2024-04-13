import { AppType } from "@/index";

export const rest =
  (app: AppType) =>
  (url: string) =>
  (method: string, body: unknown = null) => {
    const init: RequestInit = { method };

    if (body) {
      init.headers = {
        "Content-Type": "application/json",
      };

      init.body = JSON.stringify(body);
    }

    return app.request(url, init);
  };
