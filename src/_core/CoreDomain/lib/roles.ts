// src/_core/CoreDomain/lib/roles.ts
import { createRole } from '../../Actor/create-role.js';
import { CoreRedprint } from '../Redprints/CoreRedprint.js';

export const createCoreRoles = <C8 extends CoreRedprint>() => {
  const Modeler = createRole<C8>;
  const Variables = createRole<C8>;

  return {
    Modeler,
    Variables,
  };
};
