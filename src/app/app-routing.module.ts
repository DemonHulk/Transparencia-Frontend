import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Articulo33Component } from './components/articulo33/articulo33.component';
import { NewPdfComponent } from './components/forms/new-pdf/new-pdf.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'articulo33', component:Articulo33Component},
  {path: 'new-pdf', component:NewPdfComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
