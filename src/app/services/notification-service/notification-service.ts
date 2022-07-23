import { Injectable, NgZone} from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private popupService: MatSnackBar, private zone: NgZone) { }

  showSuccess(message: string): void {
    this.zone.run(() => {
      const snackBar = this.popupService.open(message, 'X');
      snackBar.onAction().subscribe(() => {
          snackBar.dismiss();
        });
      });
  }

  showError(message: string): void {
    this.zone.run(() => {
      const snackBar = this.popupService.open(message, 'X', { panelClass: ['error']});
      snackBar.onAction().subscribe(() => {
          snackBar.dismiss();
        });
      });
  }
}
