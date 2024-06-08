import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CryptoServiceService } from './services/cryptoService/crypto-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard {
  constructor(private cryptoService: CryptoServiceService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Pedimos los datos del usuario en el servicio para desencriptar los datos del localStorage
    const datosUsuarioJSON = this.cryptoService.desencriptarDatosUsuario();
    
    // Si hay datos
    if (datosUsuarioJSON) {
      const userArea = datosUsuarioJSON.id_area;

      // Recibimos los permisos de los modulos del routing Modules
      const allowedAreas = route.data['allowedAreas'] || [];
      const openToAll = route.data['openToAll'] || false;

      // Si tiene el area necesaria permite el renderizado del modulo
      if (openToAll || allowedAreas.includes(userArea)) {
        return true;
      } else {
        // Redireccionamos a la página inicial
        const router = new Router();
        router.navigate(['/articulo33']);
        return false;
      }
    } else {
      // Si no hay una sesión activa, redirigir a la página principal
      const router = new Router();
      router.navigate(['/articulo33']);
      return false;
    }
  }
}

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const guard = new AuthGuardGuard(new CryptoServiceService());
  return guard.canActivate(route, state);
};