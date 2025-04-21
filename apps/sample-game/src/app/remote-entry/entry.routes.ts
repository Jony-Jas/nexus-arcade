import { Route } from '@angular/router';
import { TestComponent } from './test.component';
import { HelpComponent } from './help.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: TestComponent,
    children: [
      {
        path: 'help',
        component: HelpComponent,
      },
    ],
  },
];
