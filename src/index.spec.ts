import { describe, it, expect } from 'vitest'

import { tw } from './index'

describe('tw', () => {
  it('should return exactly what was passed', () => {
    const actual = tw`text-large`
    const expected = `text-large`

    expect(actual).toBe(expected)
  })

  it('should return a single line w/o extra whitespace', () => {
    const actual = tw`
      text-large leading-tight
      text-black dark:text-white
    `

    const expected = `text-large leading-tight text-black dark:text-white`

    expect(actual).toBe(expected)
  })
})
