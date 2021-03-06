import { css, get } from "../src/css"

const theme = {
  colors: {
    primary: "tomato",
    secondary: "cyan",
    background: "white",
    text: "black"
  },
  fontSizes: [12, 14, 16, 24, 36],
  fonts: {
    monospace: "Menlo, monospace"
  },
  lineHeights: {
    body: 1.5
  },
  fontWeights: {
    bold: "600"
  },
  letterSpacings: ["-0.01em", "-0.02em", "0.01em"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, "512"],
  sizes: {
    small: 4,
    medium: 8,
    large: 16,
    sidebar: 320
  },
  buttons: {
    primary: {
      p: 3,
      fontWeight: "bold",
      color: "white",
      bg: "primary",
      borderRadius: 2
    }
  },
  text: {
    caps: {
      fontSize: [1, 2],
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    },
    title: {
      fontSize: [3, 4],
      letterSpacing: ["-0.01em", "-0.02em"]
    }
  },
  borderWidths: {
    thin: 1
  },
  radii: {
    small: 5
  }
}

describe("css", () => {
  test("returns an object", () => {
    const result = css()()
    expect(typeof result).toBe("object")
  })

  test("returns styles", () => {
    const result = css()({
      fontSize: 32,
      color: "blue",
      borderRadius: 4
    })
    expect(result).toEqual({
      fontSize: 32,
      color: "blue",
      borderRadius: 4
    })
  })

  test("handles all core styled system props", () => {
    const result = css({ theme })({
      m: 0,
      mb: 2,
      mx: "auto",
      p: 3,
      py: 4,
      fontSize: 3,
      fontWeight: "bold",
      color: "primary",
      bg: "secondary",
      fontFamily: "monospace",
      lineHeight: "body"
    })
    expect(result).toEqual({
      margin: 0,
      marginBottom: 8,
      marginHorizontal: "auto",
      padding: 16,
      paddingVertical: 32,
      color: "tomato",
      backgroundColor: "cyan",
      fontFamily: "Menlo, monospace",
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 1.5
    })
  })

  test("works with functional arguments", () => {
    const result = css({ theme })(t => ({
      color: t.colors.primary
    }))
    expect(result).toEqual({
      color: "tomato"
    })
  })

  test("supports functional values", () => {
    const result = css({ theme })({
      color: t => t.colors.primary
    })
    expect(result).toEqual({
      color: "tomato"
    })
  })

  test("returns variants from theme", () => {
    const result = css(theme)({
      variant: "buttons.primary"
    })
    expect(result).toEqual({
      padding: 16,
      fontWeight: "600",
      color: "white",
      backgroundColor: "tomato",
      borderRadius: 2
    })
  })

  test("handles negative margins from scale", () => {
    const result = css(theme)({
      mt: -3,
      mx: -4
    })
    expect(result).toEqual({
      marginTop: -16,
      marginHorizontal: -32
    })
  })

  test("handles string negative values", () => {
    const result = css(theme)({
      letterSpacing: 1,
      mx: 4
    })
    expect(result).toEqual({
      letterSpacing: "-0.02em",
      marginHorizontal: 32
    })
  })

  test("handles negative string values from scale", () => {
    const result = css(theme)({
      my: -8,
      mx: 4
    })
    expect(result).toEqual({
      marginVertical: "-512",
      marginHorizontal: 32
    })
  })

  test("handles negative top, left, bottom, and right from scale", () => {
    const result = css(theme)({
      top: -1,
      right: -4,
      bottom: -3,
      left: -2
    })
    expect(result).toEqual({
      top: -4,
      right: -32,
      bottom: -16,
      left: -8
    })
  })

  test("multiples are transformed", () => {
    const style = css(theme)({
      marginX: 2,
      marginY: 2,
      paddingX: 2,
      paddingY: 2,
      size: "large"
    })
    expect(style).toEqual({
      marginHorizontal: 8,
      marginVertical: 8,
      paddingHorizontal: 8,
      paddingVertical: 8,
      width: 16,
      height: 16
    })
  })

  test("returns individual border styles", () => {
    const result = css(theme)({
      borderTopWidth: "thin",
      borderTopColor: "primary",
      borderTopLeftRadius: "small",
      borderTopRightRadius: "small",
      borderTopStartRadius: "small",
      borderTopEndRadius: "small",
      borderBottomWidth: "thin",
      borderBottomColor: "primary",
      borderBottomLeftRadius: "small",
      borderBottomRightRadius: "small",
      borderBottomStartRadius: "small",
      borderBottomEndRadius: "small",
      borderRightWidth: "thin",
      borderRightColor: "primary",
      borderLeftWidth: "thin",
      borderLeftColor: "primary"
    })
    expect(result).toEqual({
      borderTopColor: "tomato",
      borderTopWidth: 1,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderTopStartRadius: 5,
      borderTopEndRadius: 5,
      borderBottomColor: "tomato",
      borderBottomWidth: 1,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderBottomStartRadius: 5,
      borderBottomEndRadius: 5,
      borderRightColor: "tomato",
      borderRightWidth: 1,
      borderLeftColor: "tomato",
      borderLeftWidth: 1
    })
  })

  test("flexBasis uses theme.sizes", () => {
    const style = css(theme)({
      flexBasis: "sidebar"
    })
    expect(style).toEqual({
      flexBasis: 320
    })
  })

  test("string values are passed as raw value numbers", () => {
    const style = css(theme)({
      fontSize: "2",
      marginX: "auto",
      marginY: "4",
      margin: "4",
      paddingX: "2",
      paddingY: "2",
      padding: "2",
      borderTopWidth: "2",
      fontWeight: "600"
    })

    expect(style).toEqual({
      fontSize: 2,
      marginHorizontal: "auto",
      marginVertical: 4,
      margin: 4,
      paddingHorizontal: 2,
      paddingVertical: 2,
      padding: 2,
      borderTopWidth: 2,
      fontWeight: "600"
    })
  })

  test("handles style properties that are objects", () => {
    const style = css(theme)({
      textShadowOffset: { width: 1, height: 1 },
      color: "primary"
    })

    expect(style).toEqual({
      textShadowOffset: { width: 1, height: 1 },
      color: "tomato"
    })
  })

  test("handles non-scale values", () => {
    const result = css(theme)({
      textDecorationLine: "line-through",
      mx: 2
    })
    expect(result).toEqual({
      textDecorationLine: "line-through",
      marginHorizontal: 8
    })
  })

  test("uses raw value if value outside of scale is used", () => {
    const result = css(theme)({
      fontSize: 10,
      mx: 10
    })
    expect(result).toEqual({
      fontSize: 10,
      marginHorizontal: 10
    })
  })
})

describe("get", () => {
  test("fallbacks to default value if object isnt present", () => {
    const result = get(null, 1, {})
    expect(result).toEqual({})
  })
})
