// src/_core/CoreDomain/lib/actors.ts
import { CoreRedprint } from '../Redprints/CoreRedprint.js';
import { createCoreRoles } from './roles.js';

export const createCoreActors = <C8 extends CoreRedprint>() => {
  const CoreRoles = createCoreRoles<C8>();

  const GetString = (getKey: PropertyKey) => ({
    Do: (fn: (str: string) => string) => ({
      Set: (setKey: PropertyKey) => {
        return CoreRoles.Variables(
          'GetString.Do.Set CoreRoles.Variables',
          'Do a generic Get Do Set operation with a string',
        )(async c8 => {
          const str = c8.utils.readonly.string(getKey);
          const result = fn(str);
          c8.var(setKey, result);
          return c8;
        });
      },
    }),
  });

  return {
    Get: {
      String: GetString,
    },
  };
};
