/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { RemoteContainerComponent } from './remote/remote-container.component';
import { Remote } from '../types';
import { InitializationGuard } from './guards/initialization.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [InitializationGuard],
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.component').then(
        (m) => m.LeaderboardComponent
      ),
    canActivate: [InitializationGuard],
  },
  {
    path: 'game/:gameId',
    component: RemoteContainerComponent,
    loadChildren: async () => {
      // Extract gameId from the current route path
      const segments = window.location.pathname.split('/');
      const gameIdIndex =
        segments.findIndex((segment) => segment === 'game') + 1;
      const remoteGameId = segments[gameIdIndex];

      try {
        const remoteModule: any = await loadRemote(`${remoteGameId}/Routes`);
        if (remoteModule && remoteModule.remoteRoutes) {
          return [
            {
              path: '',
              children: remoteModule.remoteRoutes,
            },
          ];
        }
        console.error(`No routes found for ${remoteGameId}`);
        return [];
      } catch (error) {
        console.error(`Failed to load routes for ${remoteGameId}:`, error);
        return [];
      }
    },
    data: {
      stylesUrl: 'http://localhost:4201/styles.css',
      remoteName: 'sample-game', // This should be dynamic based on the gameId
    },
    canActivate: [InitializationGuard],
  },
];

// Function to configure routes dynamically
export async function configureRoutes(remotes: Remote[]): Promise<void> {
  // const dynamicRoutes: Route[] = [];

  // // Process each remote to create routes with lazy loading
  // for (const remote of remotes) {
  //   // Create a lazy-loaded route for each remote
  //   dynamicRoutes.push({
  //     path: remote.name,
  //     component: RemoteContainerComponent,
  //     // Use lazy loading pattern with loadChildren
  //     loadChildren: async () => {
  //       try {
  //         const remoteModule: any = await loadRemote(`${remote.name}/Routes`);
  //         console.log(`Loaded remote module for ${remote.name}:`, remoteModule);
  //         if (remoteModule && remoteModule.remoteRoutes) {
  //           return remoteModule.remoteRoutes;
  //         }
  //         console.error(`No routes found for ${remote.name}`);
  //         return [];
  //       } catch (error) {
  //         console.error(`Failed to load routes for ${remote.name}:`, error);
  //         return [];
  //       }
  //     },
  //     data: {
  //       stylesUrl: remote.origin + '/styles.css',
  //       remoteName: remote.name,
  //     },
  //     canActivate: [InitializationGuard],
  //   });
  // }

  // appRoutes.push(...dynamicRoutes);
  // console.log('Updated routes:', appRoutes);

  return Promise.resolve();
}
