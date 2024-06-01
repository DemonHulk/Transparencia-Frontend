import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Articulo33Component } from './components/articulo33/articulo33.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'articulo33', component:Articulo33Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
