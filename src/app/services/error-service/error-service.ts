import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
        return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
    }

  getClientStack(error: Error): string {
      return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
    let mess = '';
    for (const message in error.error.errors) {
      if (message !== undefined) {
        if (error.error.errors[message].defaultMessage !== undefined) {
          mess +=  error.error.errors[message].defaultMessage + '. ';
        }
      }
    }
    if (mess == '') {
      return error.error.message;
    } else {
      return mess;
    }
  }

  getServerStack(error: HttpErrorResponse): string {
      // handle stack trace
      return 'stack';
  }
}
