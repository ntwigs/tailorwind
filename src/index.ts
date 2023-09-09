import {
  createElement,
  type ElementType,
  type HTMLProps,
  type JSX,
  type ComponentProps,
} from 'react'

type TagNames = keyof HTMLElementTagNameMap

type CreateBaseComponent = {
  classNames: TemplateStringsArray
  fns: (() => string)[]
  tag: TagNames
}

const getMergedClassnames = (...classNames: string[]) => {
  return classNames.join(' ').trim()
}

const getEvaluatedTemplateLiteral = <T>(
  styles: TemplateStringsArray,
  fns: ((args: T) => string)[],
  props: T
) => {
  return styles
    .map((style, i) => {
      const fn = fns[i]
      return fn ? `${style}${fn(props)}` : style
    })
    .join('')
    .replace(/\n/g, '')
    .trim()
}

/**
 * Setting default classname in order to avoid undefined values when
 * merging the classnames from declaration and execution.
 */
const DEFAULT_CLASSNAME = ''
const createBaseComponent = ({
  tag,
  classNames: classNamesFromDeclaration,
  fns,
}: CreateBaseComponent) => {
  let defaultProps = {}

  const componentFactory = ({
    children,
    className: classNameFromExecution = DEFAULT_CLASSNAME,
    ...rest
  }: HTMLProps<TagNames>) => {
    const combinedProps = { ...defaultProps, ...rest }

    const evaluatedClassNamesFromDecleration = getEvaluatedTemplateLiteral(
      classNamesFromDeclaration,
      fns,
      combinedProps
    )

    const className = getMergedClassnames(
      evaluatedClassNamesFromDecleration,
      classNameFromExecution
    )

    return createElement(tag, { ...combinedProps, className }, children)
  }

  // TODO: Need better types in here - this is a sad string dep
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
type TailorwindExtended<
  Component extends TagNames | ElementType,
  TransientProps,
> = {
  /**
   * Used to set attributes for HTML element or setting default values
   * for a component to avoid clutter and redundant component declarations.
   *
   * ex. Button.setDefaultProps({ type: 'submit' })
   */
  setDefaultProps: (
    defaultProps: ComponentProps<Component> & TransientProps
  ) => void
}

type TailorwindComponentGenerator<
  Component extends TagNames | ElementType,
  TransientProps,
> = (args: ComponentProps<Component> & TransientProps) => JSX.Element

type TailorwindPropertyAccessor = {
  [Component in TagNames]: <TransientProps>(
    literals: TemplateStringsArray,
    ...fns: ((args: TransientProps & ComponentProps<Component>) => string)[]
  ) => TailorwindComponentGenerator<Component, TransientProps> &
    TailorwindExtended<Component, TransientProps>
}

type TailorwindFunctionAccessor = <Component extends TagNames | ElementType>(
  tag: Component
) => <TransientProps>(
  literals: TemplateStringsArray,
  ...fns: ((args: TransientProps & ComponentProps<Component>) => string)[]
) => TailorwindComponentGenerator<Component, TransientProps> &
  TailorwindExtended<Component, TransientProps>

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
    (classNames: TemplateStringsArray, ...fns: (() => string)[]) =>
      createBaseComponent({ tag, classNames, fns }),

  apply: (_t: unknown, _arg: unknown, [tag]: TagNames[]) => {
    if (isTailorwindStyleHelper(tag)) {
      const [className] = tag
      return className
    }

    return (classNames: TemplateStringsArray, ...fns: (() => string)[]) =>
      createBaseComponent({ tag, classNames, fns })
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
