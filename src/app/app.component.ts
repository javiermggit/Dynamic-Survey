import { Component } from '@angular/core';
import { UiFeedbackService } from './core/services/ui-feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly loading$ = this.uiFeedbackService.loading$;
  readonly toasts$ = this.uiFeedbackService.toasts$;

  constructor(private uiFeedbackService: UiFeedbackService) {}

  removeToast(id: number): void {
    this.uiFeedbackService.removeToast(id);
  }
}
