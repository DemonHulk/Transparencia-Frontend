import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CryptoServiceService } from './services/cryptoService/crypto-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard {
  constructor(private cryptoService: CryptoServiceService, private router: Router) {} // Añadir el Router como dependencia

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const datosUsuarioJSON = this.cryptoService.desencriptarDatosUsuario();
    
    if (datosUsuarioJSON) {
      const userArea = datosUsuarioJSON.id_area;

      const allowedAreas = route.data['allowedAreas'] || [];
      const openToAll = route.data['openToAll'] || false;

      if (openToAll || allowedAreas.includes(userArea)) {
        return true;
      } else {
        this.router.navigateByUrl('/articulo33', { skipLocationChange: true });
        return false;
      }
    } else {
      if (route.routeConfig?.path === 'login') { // Verificar si la ruta es 'login'
        return true; // Permitir acceso a la página de login si no hay sesión activa
      } else {
        this.router.navigateByUrl('/articulo33', { skipLocationChange: true });
        return false;
      }
    }
  }
}

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const guard = new AuthGuardGuard(new CryptoServiceService(), new Router()); // Pasar el Router en la instancia
  return guard.canActivate(route, state);
};