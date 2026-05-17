import { Context, useContext } from 'react';

export default function useAccurateContext<T>(ctx: Context<T | null>): T {
  const value = useContext(ctx);

  if (value === null) {
    throw new Error('Empty context value');
  }

  return value;
}
