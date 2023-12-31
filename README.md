<p align="center">
  <img alt='tailor-wind' src='https://github.com/ntwigs/tailorwind/blob/HEAD/.github/assets/logo.png' width='350'/>
  <p align="center">Reusable and extensible React components using Tailwind CSS 🧶💙</p>
  <p align="center">
    <img alt='dependency-count-badge' src='https://img.shields.io/badge/dependencies-0-blue?style=flat-square' />
    <img alt='min-count' src='https://img.shields.io/bundlephobia/min/tailorwind?style=flat-square' />
    <img alt='downloads' src='https://img.shields.io/npm/dw/tailorwind?style=flat-square' />
  </p>
</div>

<hr>

# What's this? 🧶

Tailorwind is a super tiny little library that allows you to easily declare components with the utility class names from [Tailwind](https://tailwindcss.com/). Basically - you'll be able to pull stunts like these:

```
// Super basic
const ChiliButtonStyle = tw`bg-[red]`

// Kinda basic
const ChiliButton = tw.button`bg-[red]`

// Spicy basic
const ChiliButton = tw('button')`bg-[red]`

// Whoa! Look at you go!
const AnimatedChiliButton = tw(motion.button)`bg-[red]`

// You should really chillax.
const StyledComponent = styled.button`display: flex; justify-content: center;`
const ChiliButton = tw(StyledComponent)`bg-[red]`

// NOOOOOOOOOOO! 😭
const ChiliButton = tw(styled(motion.button)`display: flex;`)`justify-center bg-[red]`
```

## Getting the show on the road 🍻

I knew you'd buy right into this piece of super tiny software the moment you stepped into this repo! You can either check it out at [npmjs](https://www.npmjs.com/package/tailorwind) - or just install it using your favorite package manager.

Using **yarn** 🧶

```
yarn add tailorwind
```

or **npm** 📦

```
npm install tailorwind
```

or even **pnpm** 🍻

```
pnpm install tailorwind
```

All lined up and ready to go! 🥊 Just **slap an import** like this right onto your code and you're golden 👑

```
import { tw } from 'tailorwind'
```

## What about the intellisense? 😱

Wouldn't this break the amazing [Tailwind intellisense extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)? Fret not! There's a solution for this 🙏

First off - you'll need [the extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).
Then you'll have to [edit your vscode settings](https://code.visualstudio.com/docs/getstarted/settings) and add the following property:

```
"tailwindCSS.experimental.classRegex": [
    "tw\\.[^`]+`([^`]*)`", // tw.xxx`...`
    "tw\\(.*?\\).*?`([^`]*)" // tw(Component)`...`
]
```

I've stolen those regexes directly from [tailwind-styled-components](https://github.com/MathiasGilson/Tailwind-Styled-Component/tree/master). In other words - don't thank me for em. Skip on over to that repo and give your thanks. 🙏

## Why this? 🤔

I love [Tailwind](https://tailwindcss.com/). It's simply great. But - I was starting to get a little bit tired of the whole "div-bonanza" consisting of `<div className="p-8 bg-red-500 ... bla bla" />` and so on. I know what you're thinking - just declare a component that accepts children and use that bad boi if you'd like more verbose components. Fine, that's one way to go about it. But think of all the **lines** we're saving 💙.

We're taking this chunky chunk-chunk:

```
const ChiliButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="bg-[red]" {...props}>
      {children}
    </button>
  )
}
```

and replacing it with this slimmy slim-slim:

```
const ChiliButton = tw.button`bg-[red]`
```

It might be a 🌶️**HOT TAKE**🌶️ but I'd say it's _at least_ a little bit of a win.

## With the power of Tailorwind ⚡

You get the gist. You write smaller amounts of code and it makes it a bit easier to read. Here's my final example to trick you into using my simple little library.

```
const BaseButton = tw(motion.button)`p-8 rounded-2xl`

const variants: Variants = {
  initial: {
    scale: 0.2,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  tap: {
    scale: 0.8,
  },
  hover: {
    scale: 1.2,
  },
}

BaseButton.setDefaultProps({
  initial: 'initial',
  animate: 'animate',
  whileTap: 'tap',
  whileHover: 'hover',
  variants,
})

const Button = {
  Primary: tw(BaseButton)`bg-[red]`,
  Secondary: tw(BaseButton)`bg-[green]`,
  Tertiary: tw(BaseButton)`bg-[blue]`,
}
```

Fully animated and ready to rumble - with the power of the all mighty framer-motion. Just slap one of those motion components right in there and watch that component purr. 🧶

## Hey oh! Missing feature alert 🚨

You might end up in a corner where you need a bit more functionality. This teeny tiny lib is just supposed to do the absolute necessity to get the component declaration show on the road. If you're looking for a more [styled-components](https://styled-components.com/) type of wibe - I'd direct you right on over to: [tailwind-styled-components](https://github.com/MathiasGilson/tailwind-styled-component). That's also a teeny tiny library that's just a tad bit larger - but also does a tad bit more. 🍻 So check that out before wreaking havoc over here with your silly little feature requests. 💙

</br></br>

<p align="center"><br>
  The was built with love 🥰, black metal 🎸, and and just a bit of spare time. 💙</br></br>
  <img alt='MIT' src='https://img.shields.io/github/license/ntwigs/tailorwind?style=flat-square' />
</p>
