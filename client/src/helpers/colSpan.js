const getColSpan = (col, maxCol, isHeader) => {
  if (col === 0) {
    return isHeader
      ? { xl: 5, lg: 0, md: 0, sm: 0, xs: 0 }
      : { xl: 5, lg: 24, md: 24, sm: 24, xs: 24 }
  }
  const largeModulo = 19 % maxCol
  const smallModulo = 24 % maxCol

  const smallSize = Math.floor(24 / maxCol)
  const largeSize = Math.floor(19 / maxCol)
  const lg = col > smallModulo ? smallSize : smallSize + 1
  const md = lg
  const xl = col > largeModulo ? largeSize : largeSize + 1

  return isHeader
    ? { xl, lg, md, sm: 0, xs: 0 }
    : { xl, lg, md, sm: 24, xs: 24 }
}

export default getColSpan
