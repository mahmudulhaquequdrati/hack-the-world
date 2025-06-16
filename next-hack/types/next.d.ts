// Next.js Route Handler types
declare global {
  namespace NextJS {
    interface RouteContext {
      params: Record<string, string>;
    }
  }
}

export {};