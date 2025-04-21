import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { configureRoutes } from './app/app.routes';
import { Remote } from './types';
import { SplashScreenService } from './app/services/splash-screen.service';

export function bootstrap(remotes: Remote[]) {
  return configureRoutes(remotes)
    .then(() => {
      // Hide splash screen
      const splashService = SplashScreenService.getInstance();
      splashService.hide();
      bootstrapApplication(AppComponent, appConfig);
    })
    .catch((err) => console.error(err));
}
