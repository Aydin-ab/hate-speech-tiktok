import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DatasetComponent } from './dataset/dataset.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { RootPanelComponent } from './root-panel/root-panel.component';
import { RootAuthGuard } from './root-auth.guard';
import { AnnotationComponent } from './annotation/annotation.component';

const routes: Routes = [
  { path: "signin", component: SigninComponent, canActivate: [SecurePagesGuard] },
  { path: "dataset", component: DatasetComponent, canActivate: [AuthGuard] },
  { path: "admin_panel", component: AdminPanelComponent, canActivate: [AdminAuthGuard] },
  { path: "root_panel", component: RootPanelComponent, canActivate: [RootAuthGuard] },
  { path: "annotation", component: AnnotationComponent, canActivate:[AuthGuard] },
  { path: "", pathMatch: "full", redirectTo: "signin"},
  { path: "**", redirectTo: "signin" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
