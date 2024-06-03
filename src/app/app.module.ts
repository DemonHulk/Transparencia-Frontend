import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { Articulo33Component } from './components/articulo33/articulo33.component';
import { ContenidoPuntoComponent } from './components/articulo33/contenido-punto/contenido-punto.component';
import { TituloComponent } from './partials/titulo/titulo.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    Articulo33Component,
    ContenidoPuntoComponent,
    TituloComponent,
    NewPdfComponent,
    PageNotFoundComponent,
    NewPuntoComponent,
    ListAreasComponent,
    NewAreaComponent,
    EditAreaComponent,
    DetailsAreaComponent,
    ListTrimestresComponent,
    NewTrimestreComponent,
    EditTrimestreComponent,
    ListUsuariosComponent,
    InfoUsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
