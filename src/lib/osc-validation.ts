const X32_PATH_PREFIXES = [
  '/ch/',
  '/bus/',
  '/mtx/',
  '/main/',
  '/dca/',
  '/auxin/',
  '/fxrtn/',
  '/fxsend/',
  '/headamp/',
  '/config/',
  '/status',
  '/-stat/',
  '/-prefs/',
  '/-show/',
  '/-snap/',
  '/-action/',
  '/insert/',
  '/rtn/',
] as const;

export function isValidOscPath(path: string): boolean {
  const oscPath = path.split(' ')[0];
  return X32_PATH_PREFIXES.some((prefix) => oscPath.startsWith(prefix));
}

export function validateOscCommands(commands: string[]): { command: string; valid: boolean }[] {
  return commands.map((command) => ({
    command,
    valid: isValidOscPath(command),
  }));
}
