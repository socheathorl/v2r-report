import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRoutes } from './core/routes/page-routes';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: PageRoutes,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
