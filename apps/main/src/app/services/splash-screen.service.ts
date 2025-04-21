/**
 * SplashScreenService - A reusable service to manage splash screen across the application
 */

export class SplashScreenService {
  private static instance: SplashScreenService;
  private loadingCount = 0;

  /**
   * Get the singleton instance of SplashScreenService
   */
  public static getInstance(): SplashScreenService {
    if (!SplashScreenService.instance) {
      SplashScreenService.instance = new SplashScreenService();
    }
    return SplashScreenService.instance;
  }

  /**
   * Shows a splash screen with a message
   * @param message Message to display on the splash screen
   */
  public show(message = 'Loading...'): void {
    this.loadingCount++;

    // Create splash screen element if it doesn't exist
    let splashScreen = document.getElementById('splash-screen');

    if (!splashScreen) {
      splashScreen = document.createElement('div');
      splashScreen.id = 'splash-screen';
      splashScreen.style.position = 'fixed';
      splashScreen.style.top = '0';
      splashScreen.style.left = '0';
      splashScreen.style.width = '100%';
      splashScreen.style.height = '100%';
      splashScreen.style.background =
        'linear-gradient(to bottom, #1a1a2e, #16213e)';
      splashScreen.style.display = 'flex';
      splashScreen.style.flexDirection = 'column';
      splashScreen.style.alignItems = 'center';
      splashScreen.style.justifyContent = 'center';
      splashScreen.style.zIndex = '9999';
      splashScreen.style.opacity = '1';
      splashScreen.style.transition = 'opacity 0.5s';
      splashScreen.style.fontFamily =
        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

      const logo = document.createElement('div');
      logo.textContent = 'NEXUS ARCADE';
      logo.style.fontSize = '2.8rem';
      logo.style.fontWeight = 'bold';
      logo.style.color = '#ffffff';
      logo.style.marginBottom = '1.5rem';
      logo.style.letterSpacing = '2px';
      logo.style.textShadow = '0 0 10px rgba(0, 174, 255, 0.7)';
      logo.style.textTransform = 'uppercase';

      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.padding = '2rem';
      container.style.borderRadius = '10px';

      const messageElement = document.createElement('div');
      messageElement.id = 'splash-message';
      messageElement.style.color = '#9ba4b4';
      messageElement.style.fontSize = '1rem';
      messageElement.style.textAlign = 'center';
      messageElement.style.margin = '1rem 0';

      const spinner = document.createElement('div');
      spinner.style.width = '50px';
      spinner.style.height = '50px';
      spinner.style.border = '4px solid rgba(0, 174, 255, 0.1)';
      spinner.style.borderTop = '4px solid rgba(0, 174, 255, 1)';
      spinner.style.borderRight = '4px solid rgba(96, 239, 255, 1)';
      spinner.style.borderRadius = '50%';
      spinner.style.animation = 'spin 0.8s linear infinite';
      spinner.style.marginTop = '1.5rem';
      spinner.style.boxShadow = '0 0 15px rgba(0, 174, 255, 0.3)';

      // Add animation style if it doesn't exist
      if (!document.getElementById('splash-screen-style')) {
        const style = document.createElement('style');
        style.id = 'splash-screen-style';
        style.textContent = `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        `;
        document.head.appendChild(style);
      }

      container.appendChild(logo);
      container.appendChild(messageElement);
      container.appendChild(spinner);

      splashScreen.appendChild(container);
      document.body.appendChild(splashScreen);
    } else {
      // If splash screen exists but was hidden, show it again
      splashScreen.style.display = 'flex';
      splashScreen.style.opacity = '1';
    }

    // Update message
    const messageElement = document.getElementById('splash-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }

  /**
   * Hides the splash screen
   */
  public hide(): void {
    this.loadingCount--;

    // Only hide when all loading processes are complete
    if (this.loadingCount <= 0) {
      this.loadingCount = 0; // ensure it doesn't go negative

      const splashScreen = document.getElementById('splash-screen');
      if (splashScreen) {
        // Fade out transition
        splashScreen.style.opacity = '0';

        // Hide element after transition
        setTimeout(() => {
          if (splashScreen.parentNode) {
            splashScreen.style.display = 'none';
          }
        }, 500);
      }
    }
  }

  /**
   * Update the splash screen message
   * @param message New message to display
   */
  public updateMessage(message: string): void {
    const messageElement = document.getElementById('splash-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }

  /**
   * Completely removes the splash screen from DOM
   */
  public destroy(): void {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen && splashScreen.parentNode) {
      splashScreen.parentNode.removeChild(splashScreen);
    }

    const style = document.getElementById('splash-screen-style');
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }

    this.loadingCount = 0;
  }
}
