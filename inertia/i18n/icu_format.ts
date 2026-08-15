import IntlMessageFormat from 'intl-messageformat'

export const messageCompiler = (message, { locale, key, onError }) => {
  if (typeof message === 'string') {
    /**
     * You can tune your message compiler performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale, null, {
      ignoreTag: true,
    })
    return (ctx) => {
      return formatter.format(ctx.values)
    }
  } else {
    /**
     * for AST.
     * If you would like to support it,
     * You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
     */
    onError && onError(new Error('not support for AST'))
    return () => key
  }
}
