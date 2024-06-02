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

const routes: Routes = [
  {path: '', component:Articulo33Component},
  {path: 'login', component:LoginComponent},
  {path: 'articulo33', component:Articulo33Component},
  {path: 'new-pdf', component:NewPdfComponent},
  {path: 'new-punto', component:NewPuntoComponent},
  {path: 'new-area', component:NewAreaComponent},
  {path: 'edit-area/:id', component:EditAreaComponent},
  {path: 'areas', component:ListAreasComponent},
  {path: 'details-area/:id', component:DetailsAreaComponent},
  {path: '**', component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
