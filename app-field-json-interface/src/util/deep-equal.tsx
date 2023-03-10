const deepEqual = (x: Record<string, unknown>, y: Record<string, unknown>): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key: string) =>
          deepEqual(x[key] as Record<string, unknown>, y[key] as Record<string, unknown>)
        )
    : x === y
}

export { deepEqual }
