import {
  createElement,
  type ElementType,
  type HTMLProps,
  type JSX,
  type ComponentProps,
} from 'react'

type TagNames = keyof HTMLElementTagNameMap

type CreateBaseComponent = {
  className: string
  tag: TagNames
}

const getMergedClassnames = (...classNames: string[]) => {
  return classNames.join(' ').trim()
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
  let defaultProps = {}

  const componentFactory = ({
    children,
    className: classNameFromExecution = DEFAULT_CLASSNAME,
    ...rest
  }: HTMLProps<TagNames>) => {
    const className = getMergedClassnames(
      classNameFromExecution,
      classNameFromDeclaration
    )
    const props = { ...defaultProps, ...rest, className }
    return createElement(tag, props, children)
  }

  componentFactory['setDefaultProps'] = (
    _defaultProps: HTMLProps<TagNames>
  ) => {
    defaultProps = _defaultProps
  }

  return componentFactory
}

/**
 * Adding support for default props since default props will be deprecated
 * in a future major update of React. [https://github.com/facebook/react/pull/25699]
 */
type TailorwindExtended<Component extends TagNames | ElementType> = {
  /**
   * Used to set attributes for HTML element or setting default values
   * for a component to avoid clutter and redundant component declarations.
   *
   * ex. Button.setDefaultProps({ type: 'submit' })
   */
  setDefaultProps: (defaultProps: ComponentProps<Component>) => void
}

type TailorwindComponentGenerator<Component extends TagNames> = (
  args: JSX.IntrinsicElements[Component]
) => JSX.Element

type TailorwindPropertyAccessor = {
  [Component in TagNames]: (
    literals: TemplateStringsArray
  ) => TailorwindComponentGenerator<Component> & TailorwindExtended<Component>
}

type TailorwindFunctionAccessor = <Component extends TagNames | ElementType>(
  tag: Component
) => (
  literals: TemplateStringsArray
) => Component extends TagNames
  ? TailorwindComponentGenerator<Component> & TailorwindExtended<Component>
  : Component & TailorwindExtended<Component>

type TailorwindTemplateLiteralAccessor = (
  literals: TemplateStringsArray
) => string

type TailorwindFunction = TailorwindPropertyAccessor &
  TailorwindFunctionAccessor &
  TailorwindTemplateLiteralAccessor

const isTailorwindStyleHelper = (arg: unknown): arg is TemplateStringsArray =>
  Array.isArray(arg)

const handler = {
  get:
    (_t: unknown, tag: TagNames) =>
    ([className]: TemplateStringsArray) =>
      createBaseComponent({ tag, className }),
  apply: (_t: unknown, _arg: unknown, [tag]: TagNames[]) => {
    if (isTailorwindStyleHelper(tag)) {
      const [className] = tag
      return className
    }

    return ([className]: TemplateStringsArray) =>
      createBaseComponent({ tag, className })
  },
}

/**
 * Properties are set in the proxy handler. Therefore were casting
 * the EMPTY_PROXY_TARGET.
 */
const EMPTY_PROXY_TARGET = (() => {}) as unknown as TailorwindFunction
export const tw: TailorwindFunction = new Proxy<TailorwindFunction>(
  EMPTY_PROXY_TARGET,
  handler
)
