declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      FRONTEND_URL: string;
      NODE_ENV?: "development" | "production" | "test";
    }
  }