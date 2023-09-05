import {
  createElement,
  type ElementType,
  type HTMLProps,
  type JSX,
} from 'react'

type TagNames = keyof HTMLElementTagNameMap

type CreateBaseComponent = {
  className: string
  tag: TagNames
}

/**
 * Setting default classname in order to avoid undefined values when
 * merging the classnames from declaration and execution.
 */
const DEFAULT_CLASSNAME = ''
const createBaseComponent = ({
  tag,
  className: classNameFromDeclaration = DEFAULT_CLASSNAME,
}: CreateBaseComponent) => {
  return ({
    children,
    className: classNameFromExecution = DEFAULT_CLASSNAME,
    ...rest
  }: HTMLProps<TagNames>) => {
    const classMerge =
      `${classNameFromExecution} ${classNameFromDeclaration}`.trim()
    return createElement(tag, { ...rest, className: classMerge }, children)
  }
}

type TailorwindComponentGenerator<Component extends TagNames> = (
  args: JSX.IntrinsicElements[Component]
) => JSX.Element

type TailorwindPropertyAccessor = {
  [Component in TagNames]: (
    literals: TemplateStringsArray
  ) => TailorwindComponentGenerator<Component>
}

type TailorwindFunctionAccessor = <Component extends TagNames | ElementType>(
  tag: Component
) => (
  literals: TemplateStringsArray
) => Component extends TagNames
  ? TailorwindComponentGenerator<Component>
  : Component

type TailorwindFunction = TailorwindPropertyAccessor &
  TailorwindFunctionAccessor

const handler = {
  get:
    (_t: unknown, tag: TagNames) =>
    ([className]: TemplateStringsArray) =>
      createBaseComponent({ tag, className }),
  apply:
    (_t: unknown, _arg: unknown, [tag]: TagNames[]) =>
    ([className]: TemplateStringsArray) =>
      createBaseComponent({ tag, className }),
}

/**
 * Properties are set in the proxy handler. Therefore were casting
 * the EMPTY_PROXY_TARGET.
 */
const EMPTY_PROXY_TARGET = (() => {}) as unknown as TailorwindFunction
export const tc: TailorwindFunction = new Proxy<TailorwindFunction>(
  EMPTY_PROXY_TARGET,
  handler
)
