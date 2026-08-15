export default async () => {
  const r = await import.meta.glob('../../resources/lang/*.json')

  const keys = Object.keys(r).map((k) =>
    k.replace('.json', '').replace('../../resources/lang/', '')
  )

  const i18n = {}

  for (const p of keys) {
    // @ts-ignore
    const importedModule = await r[Object.keys(r).find((k) => k.includes(`${p}.json`))]()
    // @ts-ignore
    i18n[p] = importedModule.default
  }

  return i18n
}
