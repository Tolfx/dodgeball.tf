export default function getEnv(env: string, defaultValue?: string) {
  const value = process.env[env];
  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`Environment variable ${env} is not set`);
  }
  return value;
}
