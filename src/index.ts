type Nullable<T> = T | undefined | null
type Primitive = string | number | boolean

type FunctionExpression = (...props: Array<unknown>) => Primitive | Array<Primitive>
type PrimitiveExpression = Primitive | Array<Primitive>
type SingularExpression = FunctionExpression | PrimitiveExpression
type NullableExpression = undefined | null
type Expression = SingularExpression | Array<SingularExpression> | NullableExpression

interface TwExpandableResult {
  class?: string | undefined | null
  style?: string | Record<string, unknown> | undefined | null
}

type TwFunction<T> = (strings: TemplateStringsArray, ...exprs: Array<Expression>) => T

const SPACE_CH = ' '
const SPACE_RE = /\s{2,}/g

function isFunction(x: unknown): x is CallableFunction {
  return typeof x === 'function'
}

function isDefined(x: unknown): boolean {
  return x !== undefined && x !== null
}

const tw: TwFunction<string> = (strings, ...exprs) => {
  // Flatten, then evaluate all lazy expressions if any.
  const values = exprs
    .filter(isDefined)
    .map((expr) =>
      (Array.isArray(expr) ? expr.flat(Infinity) : [expr]).map((normalizedExpr) =>
        isFunction(normalizedExpr) ? normalizedExpr() : normalizedExpr
      )
    )

  const reduced = strings.reduce((accumulator, current, index) => {
    const value = values[index]

    // Flatten (deep) just in case an expression returns an array of strings.
    const flattenedTuple = Array.isArray(value) ? value.flat(Infinity) : [value]

    // Perform exhaustive (and probably excessive) checks and throw if stumbled upon a non-
    // convertible value without `toString`, e.g. a naked object created with `Object.create(null)`.
    if (
      flattenedTuple.some(
        (flattenedValue) =>
          flattenedValue !== null &&
          flattenedValue !== undefined &&
          (typeof flattenedValue.toString !== 'function' ||
            typeof flattenedValue.valueOf !== 'function')
      )
    ) {
      throw new TypeError(`Cannot convert object to primitive value: missing 'toString' method.`)
    }

    const normalizedValue = flattenedTuple.join('')
    const next = index >= values.length ? current : current + normalizedValue

    return accumulator + next
  }, String())

  return reduced.trim().replace(SPACE_RE, SPACE_CH)
}

const withVariables = (
  variables: Record<string, Nullable<string>>
): TwFunction<TwExpandableResult> => {
  const filteredCssVariables = Object.entries(variables).filter(([_, value]) => Boolean(value))
  const collectedCssVariables = Object.fromEntries(filteredCssVariables)

  return (strings: TemplateStringsArray, ...exprs: Array<Expression>) => ({
    class: tw(strings, ...exprs),
    style: collectedCssVariables
  })
}

export { tw, withVariables, type TwFunction, type TwExpandableResult }
