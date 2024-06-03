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
import { ListUsuariosComponent } from './components/tables/list-usuarios/list-usuarios.component';
import { InfoUsuariosComponent } from './components/tables/info-usuarios/info-usuarios.component';
import { ListPuntosComponent } from './components/tables/list-puntos/list-puntos.component';
import { DetailsPuntoComponent } from './components/tables/list-puntos/details-punto/details-punto.component';
import { EditPuntoComponent } from './components/forms/edit-punto/edit-punto.component';
import { EditPdfComponent } from './components/forms/edit-pdf/edit-pdf.component';
import { NewTemaComponent } from './components/forms/new-tema/new-tema.component';
import { EditTemaComponent } from './components/forms/edit-tema/edit-tema.component';
import { NewSubtemaComponent } from './components/forms/new-subtema/new-subtema.component';
import { EditSubtemaComponent } from './components/forms/edit-subtema/edit-subtema.component';

const routes: Routes = [
  {path: '', component:Articulo33Component},
  {path: 'login', component:LoginComponent},
  {path: 'articulo33', component:Articulo33Component},
  {path: 'new-pdf/:punto/:tema', component:NewPdfComponent},
  {path: 'new-punto', component:NewPuntoComponent},
  {path: 'new-area', component:NewAreaComponent},
  {path: 'new-trimestre', component:NewTrimestreComponent},
  {path: 'new-tema/:punto', component:NewTemaComponent},
  {path: 'new-subtema/:tema', component:NewSubtemaComponent},
  {path: 'edit-area/:id', component:EditAreaComponent},
  {path: 'edit-trimestre/:id', component:EditTrimestreComponent},
  {path: 'edit-punto/:id', component:EditPuntoComponent},
  {path: 'edit-tema/:id', component:EditTemaComponent},
  {path: 'edit-pdf/:punto/:contenido', component:EditPdfComponent},
  {path: 'edit-subtema/:tema/:id', component:EditSubtemaComponent},
  {path: 'areas', component:ListAreasComponent},
  {path: 'trimestres', component:ListTrimestresComponent},
  {path: 'puntos', component:ListPuntosComponent},
  {path: 'details-area/:id', component:DetailsAreaComponent},
  {path: 'usuarios', component:ListUsuariosComponent},
  {path: 'info-usuarios', component:InfoUsuariosComponent},
  {path: 'details-punto/:id', component:DetailsPuntoComponent},
  {path: '**', component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
