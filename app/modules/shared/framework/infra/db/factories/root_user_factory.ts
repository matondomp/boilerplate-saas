import env from '#start/env'

export const rootUser = {
  email: env.get('ROOT_USER_EMAIL') ?? 'root@mp.co.ao',
  password: env.get('ROOT_USER_PASSWORD') ?? '12345678',
}
