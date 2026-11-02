/**
 * Development environment for HRMS.Web.
 * The Angular dev-server uses proxy.conf.json to forward `/api/*` to the
 * .NET backend at http://localhost:5000.
 */
export const environment = {
  production: false,
  apiUrl: '/api',
};
