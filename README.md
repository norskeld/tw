# tw

<!-- [![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@nrsk/tw?style=flat-square&colorA=22272d&colorB=22272d&label=minzipped)](https://bundlephobia.com/package/@nrsk/tw) -->
<!-- ![Tree Shaking](https://img.shields.io/static/v1?label=tree+shaking&message=✔&style=flat-square&colorA=22272d&colorB=22272d) -->

[![Build/Test](https://img.shields.io/github/actions/workflow/status/norskeld/tw/test.yml?style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/norskeld/tw/actions 'Build and test workflows')
[![Coverage](https://img.shields.io/coverallsCoverage/github/norskeld/tw?style=flat-square&colorA=22272d&colorB=22272d)](https://coveralls.io/github/norskeld/tw 'Test coverage')
[![NPM](https://img.shields.io/npm/v/@nrsk/tw?style=flat-square&colorA=22272d&colorB=22272d)](https://npm.im/@nrsk/tw 'This package on NPM')
![Supported Node Versions](https://img.shields.io/node/v/%40nrsk/backpack?style=flat-square&colorA=22272d&colorB=22272d)
[![Semantic Release](https://img.shields.io/static/v1?label=semantic+release&message=✔&style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/semantic-release/semantic-release 'This package uses semantic release to handle releasing, versioning, changelog generation and tagging')
[![Conventional Commits](https://img.shields.io/static/v1?label=conventional+commits&message=✔&style=flat-square&colorA=22272d&colorB=22272d)](https://conventionalcommits.org 'This package follows the conventional commits spec and guidelines')

Weird helpers for working with [Tailwind] in [Astro]-only components.

## Motivation

Yeah, it kinda reminds CSS-in-JS (and I honestly hate it), but this is somehow better for my eye than filling the markup with dozens of classes and making it unreadable even with the text wrap on.

## Installation

Just use your favorite package manager:

```bash
npm i @nrsk/tw
```

## Configuration

After that you will likely want to configure VS Code to make Wailwind intellisense work with `` tw`...` `` tagged templates and Astro class-attributes.

Just add these two lines into your `.vscode/settings.json`:

```jsonc
{
  // This is to make tailwind intellisense work with special Astro's "class:list" attributes.
  "tailwindCSS.classAttributes": ["class", "className", "class:list"],

  // This is to make tailwind intellisense work with tw`...` utility.
  "tailwindCSS.experimental.classRegex": ["[tT]w`([^`]+)"]
}
```

## Usage

This library exposes two functions: `tw` and `withVariables`.

### `tw`

This is a tagged template that allows you to write something like this in your Astro components:

```astro
---
import { tw } from '@nrsk/tw'

import type { ArticleEntry } from '@/api/content/articles'

import CardGrid from '@/components/CardGrid.astro'
import Header from '@/components/Header.astro'
import Link from '@/components/Link.astro'

import RecentArticlesCard from './RecentArticlesCard.astro'

export interface Props {
  items: Array<ArticleEntry>
}

const { items } = Astro.props

const sectionClasses = tw`
  flex flex-col gap-6
`

const noteClasses = tw`
  text-gray-700 dark:text-gray-300
`

const headingClasses = tw`
  text-2xl md:text-4xl font-bold tracking-tight
  text-black dark:text-white
`

const linkClasses = tw`
  group transition-[color]
  text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
`

const linkArrowClasses = tw`
  group-hover:ml-1
  font-semibold transition-[margin-left]
`
---

<section class={sectionClasses}>
  <Header>
    <h2 slot="heading" class={headingClasses}>
      Recent articles
    </h2>

    <p slot="sub" class={noteClasses}>
      I occasionally write about <strong>Rust</strong>, <strong>functional programming</strong>,
      and <strong>front-end</strong> stuff.
    </p>
  </Header>

  <CardGrid>
    {items.map((article) => <RecentArticlesCard item={article} />)}
  </CardGrid>

  <footer>
    <Link to="/blog" class={linkClasses}>
      Read all articles <span class={linkArrowClasses}>&srarr;</span>
    </Link>
  </footer>
</section>
```

### `withVariables`

Allows to "inject" CSS variables into `` tw`...` `` scope to avoid issues with tailwind sometimes not recognizing string interpolations. Example:

```astro
---
import { withVariables } from '@nrsk/tw'

const colors = ['#3178c6', '#4c83bd'] as const

// `withVariables` returns `tw` function...
const withColorsTw = withVariables({
  '--color-light': colors.at(0) ?? 'currentColor',
  '--color-dark': colors.at(1) ?? 'currentColor',
})

// ...so it can be used as usual, but `languageClasses` will be not a string, but an object:
//
// {
//    class: 'text-[color:var(--color-light)] dark:text-[color:v (--color-dark)]',
//    style: {
//      '--color-light': '#3178c6',
//      '--color-dark': '#4c83bd',
//    }
// }
const languageClasses = withColorsTw`
  text-[color:var(--color-light)]
  dark:text-[color:var(--color-dark)]
`
---

<!-- And in the end `languageClasses` can be either expanded via spread... -->
<span {...languageClasses}>...</span>

<!-- ...or used manually. -->
<span class={languageClasses.class} style={languageClasses.style}>
  ...
</span>
```

## License

[MIT](LICENSE).

<!-- Links. -->

[tailwind]: https://tailwindcss.com
[astro]: https://astro.build
