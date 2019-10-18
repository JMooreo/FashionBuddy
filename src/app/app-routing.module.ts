import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(m => m.RegisterPageModule)
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "tabs",
    loadChildren: () =>
      import("./pages/tabs/tabs.module").then(m => m.TabsPageModule)
  },
  {
    path: "captured-image-modal",
    loadChildren: () =>
      import("./pages/upload/captured-image-modal/captured-image-modal.module").then(m => m.CapturedImageModalPageModule)
  },
  {
    path: "contest-overlay",
    loadChildren: () =>
      import("./pages/results/contest-overlay/contest-overlay.module").then(m => m.ContestOverlayPageModule)
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pages/settings/settings.module").then(m => m.SettingsPageModule)
  },
  {
    path: "password-reset",
    loadChildren: () =>
      import("./pages/password-reset/password-reset.module").then(m => m.PasswordResetPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
