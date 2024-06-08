import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from '@tinymce/tinymce-angular';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { OverlayModule } from 'primeng/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    ListPuntosComponent,
    DetailsPuntoComponent,
    EditPuntoComponent,
    EditPdfComponent,
    NewTemaComponent,
    EditTemaComponent,
    NewSubtemaComponent,
    EditSubtemaComponent,
    MiPerfilComponent,
    EditPerfilComponent,
    ListUsuariosComponent,
    DetailsUsuarioComponent,
    NewUsuarioComponent,
    EditUsuarioComponent,
    NewWordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    PaginatorModule,
    OverlayModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
