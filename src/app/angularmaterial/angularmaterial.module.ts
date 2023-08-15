import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  exports: [
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
})
export class AngularmaterialModule {}
