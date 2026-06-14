import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication } from '../services/authentication';

// Functional HTTP Interceptor to append JWT bearer tokens to secure outgoing requests
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    
    // Inject the authentication service directly inside the functional context
    const authenticationService = inject(Authentication);
    
    let isAuthAPI: boolean;

    // Check if the request target points to open authentication pipelines
    if (req.url.startsWith('login') || req.url.startsWith('register')) {
        isAuthAPI = true;
    } else {
        isAuthAPI = false;
    }

    // If the user possesses an active session and the request is not hitting auth endpoints
    if (authenticationService.isLoggedIn() && !isAuthAPI) {
        // Fetch the secure cryptographically signed token string
        const token = authenticationService.getToken();

        // Clone the immutable request and attach the authorization credentials headers
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        // Forward the newly authorized request down the execution pipeline
        return next(authReq);
    }

    // Else, forward the un-modified original request down the execution pipeline
    return next(req);
};
