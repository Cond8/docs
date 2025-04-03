// packages/_core/src/CoreDomain/Redprints/CoreRedprint.ts
import { CoreBlueprint } from '../Blueprints/CoreBlueprint.js';
import { StrictKVBlueprintSync } from '../Blueprints/StrictKVBlueprint-Sync.js';
import { StrictKVBlueprint } from '../Blueprints/StrictKVBlueprint.js';
import { ConduitUtils } from './ConduitUtils.js';

export abstract class CoreRedprint {
  public readonly utils: ConduitUtils<this>;

  public abstract locals: StrictKVBlueprintSync;
  public cache?: StrictKVBlueprint;
  [key: symbol]: CoreBlueprint;

  protected constructor(readonly body?: object) {
    this.utils = new ConduitUtils(this);
  }

  public var<T>(key: PropertyKey, value?: T): T | undefined {
    if (value === undefined) {
      return this.locals.get(key) as T;
    }
    this.locals.set(key, value);
  }
}
