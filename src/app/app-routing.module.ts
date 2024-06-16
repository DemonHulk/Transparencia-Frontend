import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Articulo33Component } from './components/articulo33/articulo33.component';
import { NewPdfComponent } from './components/forms/new-pdf/new-pdf.component';
import { PageNotFoundComponent } from './partials/page-not-found/page-not-found.component';
import { NewPuntoComponent } from './components/forms/new-punto/new-punto.component';
import { ListAreasComponent } from './components/tables/list-areas/list-areas.component';
import { NewAreaComponent } from './components/forms/new-area/new-area.component';
import { EditAreaComponent } from './components/forms/edit-area/edit-area.component';
import { DetailsAreaComponent } from './components/tables/list-areas/details-area/details-area.component';
import { ListTrimestresComponent } from './components/tables/list-trimestres/list-trimestres.component';
import { NewTrimestreComponent } from './components/forms/new-trimestre/new-trimestre.component';
import { EditTrimestreComponent } from './components/forms/edit-trimestre/edit-trimestre.component';
import { ListPuntosComponent } from './components/tables/list-puntos/list-puntos.component';
import { DetailsPuntoComponent } from './components/tables/list-puntos/details-punto/details-punto.component';
import { EditPuntoComponent } from './components/forms/edit-punto/edit-punto.component';
import { EditPdfComponent } from './components/forms/edit-pdf/edit-pdf.component';
import { NewTemaComponent } from './components/forms/new-tema/new-tema.component';
import { EditTemaComponent } from './components/forms/edit-tema/edit-tema.component';
import { NewSubtemaComponent } from './components/forms/new-subtema/new-subtema.component';
import { EditSubtemaComponent } from './components/forms/edit-subtema/edit-subtema.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { EditPerfilComponent } from './components/forms/edit-perfil/edit-perfil.component';
import { ListUsuariosComponent } from './components/tables/list-usuarios/list-usuarios.component';
import { DetailsUsuarioComponent } from './components/tables/list-usuarios/details-usuario/details-usuario.component';
import { NewUsuarioComponent } from './components/forms/new-usuario/new-usuario.component';
import { EditUsuarioComponent } from './components/forms/edit-usuario/edit-usuario.component';
import { NewWordComponent } from './components/forms/new-word/new-word.component';
import { authGuardGuard } from './auth-guard.guard';
import { ListEjercicioComponent } from './components/tables/list-ejercicio/list-ejercicio.component';
import { NewEjercicioComponent } from './components/forms/new-ejercicio/new-ejercicio.component';
import { EditEjercicioComponent } from './components/forms/edit-ejercicio/edit-ejercicio.component';

// data indicamos que area puede entrar a las rutas
// openToall todos los que tengan sesion
// allowedAreas 1 = administrador (en caso de tener mas de una agregar el id del area correspondiente)
const routes: Routes = [
  {path: '', component:Articulo33Component},
  {path: 'login', component:LoginComponent, canActivate: [authGuardGuard]},
  {path: 'articulo33', component:Articulo33Component},
  {path: 'myprofile', component:MiPerfilComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'new-pdf/:punto/:tema', component:NewPdfComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'new-punto', component:NewPuntoComponent , canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'new-area', component:NewAreaComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'new-trimestre', component:NewTrimestreComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'new-tema/:punto', component:NewTemaComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'new-subtema/:tema', component:NewSubtemaComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'new-usuario', component:NewUsuarioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'new-ejercicio', component:NewEjercicioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'edit-area/:id', component:EditAreaComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'edit-trimestre/:id', component:EditTrimestreComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'edit-punto/:id', component:EditPuntoComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'edit-tema/:id', component:EditTemaComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'edit-pdf/:punto/:contenido', component:EditPdfComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'edit-subtema/:tema/:id', component:EditSubtemaComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'edit-perfil', component:EditPerfilComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'edit-usuario/:id', component:EditUsuarioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'edit-ejercicio/:id', component:EditEjercicioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'areas', component:ListAreasComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'trimestres', component:ListTrimestresComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'puntos', component:ListPuntosComponent, canActivate: [authGuardGuard], data: { openToAll: true }},
  {path: 'usuarios', component:ListUsuariosComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'ejercicios', component:ListEjercicioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'details-area/:id', component:DetailsAreaComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'details-punto/:id', component:DetailsPuntoComponent, canActivate: [authGuardGuard], data: { openToAll: true } },
  {path: 'details-usuario/:id', component:DetailsUsuarioComponent, canActivate: [authGuardGuard], data: { allowedAreas: ['1'] }},
  {path: 'new-word/:punto/:tema', component:NewWordComponent, canActivate: [authGuardGuard], data: { openToAll: true }},
  {path: '**', component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
