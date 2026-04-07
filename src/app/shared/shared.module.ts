import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { UiCardComponent } from './components/ui-card/ui-card.component';



@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    UiButtonComponent,
    UiCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSpinnerComponent,
    UiButtonComponent,
    UiCardComponent
  ]
})
export class SharedModule { }
