import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

function uniq<T>(array: T[]) {
  return Array.from(new Set(array))
}

function uniqueElementsBy<T>(
  array: T[],
  fn: (a: T, b: T, array: T[]) => boolean,
) {
  return array.reduce<T[]>((acc, v) => {
    if (!acc.some(x => fn(v, x, array)))
      acc.push(v)
    return acc
  }, [])
}

/**
 * reactive unique array
 * @see https://vueuse.org/useArrayUnique
 * @param {Array} list - the array was called upon.
 * @param compareFn
 * @returns {Array} A computed ref that returns a unique array of items.
 */
export function useArrayUnique<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>, compareFn?: (a: T, b: T, array: T[]) => boolean): ComputedRef<T[]> {
  return computed<T[]>(() => {
    const resolvedList = resolveUnref(list).map(element => resolveUnref(element))
    return compareFn ? uniqueElementsBy(resolvedList, compareFn) : uniq(resolvedList)
  })
}
