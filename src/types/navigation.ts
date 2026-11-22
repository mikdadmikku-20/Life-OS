export type FutureRouteId =
  | 'get-started'
  | 'sign-in'
  | 'platform'
  | 'privacy'
  | 'terms';

export interface RoutePreviewInfo {
  id: FutureRouteId;
  title: string;
  routePath: string;
  summary: string;
  statusNote: string;
}

export type AppViewMode = 'landing' | 'app' | 'dashboard';
