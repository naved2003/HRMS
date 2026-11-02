/**
 * Production environment for HRMS.Web.
 * The Angular dev-server uses proxy.conf.json to forward `/api/*` to the
 * .NET backend at http://localhost:5000 — so the browser-side URL stays relative.
 */
export const environment = {
  production: true,
  apiUrl: '/api',
};
