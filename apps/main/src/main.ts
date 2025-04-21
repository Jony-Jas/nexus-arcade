import { init } from '@module-federation/enhanced/runtime';
import { Remote } from './types';
import { SplashScreenService } from './app/services/splash-screen.service';

/**
 * Main application initialization
 */
async function initializeApplication(): Promise<void> {
  try {
    const splashService = SplashScreenService.getInstance();
    splashService.show('Loading your application...');
    const remotes = await fetchRemoteApps();
    await initModuleFederation(remotes);
    await bootstrapApplication(remotes);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Fetches remote applications from manifest
 */
async function fetchRemoteApps(): Promise<Remote[]> {
  // Show splash screen during loading

  // TODO: Fetch user-specific manifest
  const response = await fetch('http://localhost:3000/api/mf-manifest');
  const remoteEntries = (await response.json()) as Record<string, string>;

  if (!response.ok) {
    throw new Error(
      `Failed to fetch manifest: ${response.status} ${response.statusText}`
    );
  }

  return Object.entries(remoteEntries).map(([name, entry]) => ({
    name,
    entry,
    origin: entry.split('/').slice(0, -1).join('/'),
  })) as Remote[];
}

/**
 * Initializes module federation with remote apps
 */
async function initModuleFederation(remotes: Remote[]): Promise<void> {
  await init({ name: 'main', remotes });
}

/**
 * Bootstraps the application with remote apps
 */
async function bootstrapApplication(remotes: Remote[]): Promise<void> {
  const { bootstrap } = await import('./bootstrap');
  await bootstrap(remotes);
}

/**
 * Handles application errors
 */
function handleError(error: unknown): void {
  console.error('Application initialization failed:', error);
  // Consider adding more sophisticated error handling here
  // such as error reporting or user notification

  // Show error on splash screen
  const splashService = SplashScreenService.getInstance();
  splashService.updateMessage('Failed to load application. Please try again.');
}

// Start the application
initializeApplication();
