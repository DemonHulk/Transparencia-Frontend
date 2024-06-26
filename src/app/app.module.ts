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
import { EditPerfilComponent } from './components/forms/edit-perfil/edit-perfil.component';
import { ListUsuariosComponent } from './components/tables/list-usuarios/list-usuarios.component';
import { DetailsUsuarioComponent } from './components/tables/list-usuarios/details-usuario/details-usuario.component';
import { NewUsuarioComponent } from './components/forms/new-usuario/new-usuario.component';
import { EditUsuarioComponent } from './components/forms/edit-usuario/edit-usuario.component';
import { NewWordComponent } from './components/forms/new-word/new-word.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListEjercicioComponent } from './components/tables/list-ejercicio/list-ejercicio.component';
import { NewEjercicioComponent } from './components/forms/new-ejercicio/new-ejercicio.component';
import { EditEjercicioComponent } from './components/forms/edit-ejercicio/edit-ejercicio.component';
import { FormComponent } from './components/skeleton/form/form.component';
import { LoadingSpinnerComponent } from './components/skeleton/loading-spinner/loading-spinner.component';
import { ErrorLoadingComponent } from './partials/error-loading/error-loading.component';
import { EditWordComponent } from './components/forms/edit-word/edit-word.component';
import { ContenidoItemComponent } from './components/articulo33/contenido-punto/contenido-item/contenido-item.component';
import { ContenidoPuntoSkeletonComponent } from './components/skeleton/contenido-punto-skeleton/contenido-punto-skeleton.component';
import { SubtemasComponent } from './components/tables/list-puntos/details-punto/subtemas/subtemas.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdministrarOrdenComponent } from './components/tables/list-puntos/administrar-orden/administrar-orden.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ContenidoSubtemaComponent } from './components/tables/list-puntos/details-punto/subtemas/contenido-subtema/contenido-subtema.component';
import { RecursiveNavItemComponent } from './components/tables/list-puntos/details-punto/subtemas/recursive-nav-item/recursive-nav-item.component';
import { ListHistorialComponent } from './components/tables/list-historial/list-historial.component';


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
    EditPerfilComponent,
    ListUsuariosComponent,
    DetailsUsuarioComponent,
    NewUsuarioComponent,
    EditUsuarioComponent,
    NewWordComponent,
    ListEjercicioComponent,
    NewEjercicioComponent,
    EditEjercicioComponent,
    FormComponent,
    LoadingSpinnerComponent,
    ErrorLoadingComponent,
    EditWordComponent,
    ContenidoItemComponent,
    ContenidoPuntoSkeletonComponent,
    SubtemasComponent,
    AdministrarOrdenComponent,
    AcercaDeComponent,
    ListHistorialComponent,
    ContenidoSubtemaComponent,
    RecursiveNavItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
