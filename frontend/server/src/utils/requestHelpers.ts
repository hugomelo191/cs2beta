import { Request } from 'express';

export const getParam = (req: Request, key: string): string => {
  const value = req.params?.[key];
  if (!value) {
    throw new Error(`Missing required parameter: ${key}`);
  }
  return value;
};

export const getQuery = (req: Request, key: string): string | undefined => {
  return req.query?.[key] as string;
};

export const getQueryInt = (req: Request, key: string, defaultValue?: number): number => {
  const value = req.query?.[key] as string;
  return value ? parseInt(value) : (defaultValue || 0);
};

export const getBody = <T>(req: Request): T => {
  return req.body as T;
}; 