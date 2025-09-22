import { TransactionalEmailsApi } from "@getbrevo/brevo";

export const emailAPI = (() => {
  const api = new TransactionalEmailsApi();
  api.authentications.apiKey.apiKey = process.env.BREVO_API;
  return api;
})();