import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  template: `
    <div class="help-container">
      <h2>Help</h2>
      <p>
        Welcome to the help section. If you have any questions, please refer to
        the documentation below.
      </p>

      <!-- Add your help content here -->
    </div>
  `,
  styles: [
    `
      .help-container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      h2 {
        color: #333;
      }
    `,
  ],
})
export class HelpComponent {}
