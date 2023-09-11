import {
  createElement,
  type ElementType,
  type HTMLProps,
  type JSX,
  type ComponentProps,
} from 'react'

type TagNames = keyof HTMLElementTagNameMap

type TemplateLiteralTag =
  | (<Component extends TagNames | ElementType, TransientProps>(
      args: TransientProps & ComponentProps<Component>
    ) => string)
  | string

type CreateBaseComponent = {
  classNames: TemplateStringsArray
  tags: TemplateLiteralTag[]
  tag: TagNames
}

const getMergedClassnames = (...classNames: string[]) => {
  return classNames.join(' ').trim()
}

const getEvaluatedTemplateLiteral = <T>(
  styles: TemplateStringsArray,
  tags: TemplateLiteralTag[],
  props: T
) => {
  return styles
    .map((style, i) => {
      const tag = tags[i]
      return tag
        ? `${style}${typeof tag === 'function' ? tag(props) : tag}`
        : style
    })
    .join('')
    .replace(/\n/g, '')
    .trim()
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
    defaultProps: Partial<ComponentProps<Component> & TransientProps>
  ) => void
}

/**
 * Setting default classname in order to avoid undefined values when
 * merging the classnames from declaration and execution.
 */
const DEFAULT_CLASSNAME = ''
const createBaseComponent = ({
  tag,
  classNames: classNamesFromDeclaration,
  tags,
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
      tags,
      combinedProps
    )

    const className = getMergedClassnames(
      evaluatedClassNamesFromDecleration,
      classNameFromExecution
    )

    return createElement(tag, { ...combinedProps, className }, children)
  }

  const extendedComponentFactory = componentFactory as TailorwindExtended<
    typeof tag,
    HTMLProps<typeof tag>
  > &
    typeof componentFactory

  extendedComponentFactory['setDefaultProps'] = (extendedProps) => {
    defaultProps = extendedProps
  }

  return extendedComponentFactory
}

type TailorwindComponentGenerator<
  Component extends TagNames | ElementType,
  TransientProps,
> = (args: ComponentProps<Component> & TransientProps) => JSX.Element

type TailorwindComponent<Component extends TagNames | ElementType, TransientProps> = TailorwindComponentGenerator<Component, TransientProps> & TailorwindExtended<Component, TransientProps>

type TailorwindGeneratorFn<Component extends TagNames | ElementType> = <
  TransientProps,
>(
  literals: TemplateStringsArray,
  ...fns: TemplateLiteralTag[]
) => TailorwindComponent<Component, TransientProps>

type TailorwindPropertyAccessor = {
  [Component in TagNames]: TailorwindGeneratorFn<Component>
}

type TailorwindFunctionAccessor = <Component extends TagNames | ElementType>(
  tag: Component
) => TailorwindGeneratorFn<Component>

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
    (classNames: TemplateStringsArray, ...tags: TemplateLiteralTag[]) =>
      createBaseComponent({ tag, classNames, tags }),

  apply: (_t: unknown, _arg: unknown, [tag]: TagNames[]) => {
    if (isTailorwindStyleHelper(tag)) {
      const [className] = tag
      return className
    }

    return (classNames: TemplateStringsArray, ...tags: TemplateLiteralTag[]) =>
      createBaseComponent({ tag, classNames, tags })
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
