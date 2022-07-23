import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestTokenInjectorService implements HttpInterceptor {

  constructor(private inj: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authenticationService: AuthenticationService = this.inj.get(AuthenticationService);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authenticationService.getToken()}`
      }
    });

    return next.handle(request);
  }


}
