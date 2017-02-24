import { Runtype, Rt, Static, create } from '../runtype'
import { hasKey } from '../util'
import { ValidationError } from '../validation-error'

export interface Record<O extends { [_ in string]: Rt }> extends Runtype<{[K in keyof O]: Static<O[K]> }> {
  tag: 'record'
  fields: O
}

/**
 * Construct a record runtype from runtypes for its values.
 */
export function Record<O extends { [_: string]: Rt }>(fields: O) {
  return create<Record<O>>(x => {
    if (x === null || x === undefined)
      throw new ValidationError(`Expected a defined non-null value but was ${typeof x}`)

    // tslint:disable-next-line:forin
    for (const key in fields) {
      if (hasKey(key, x))
        fields[key].check(x[key])
      else
        throw new ValidationError(`Missing property ${key}`)
    }

    return x as O
  }, { tag: 'record', fields })
}