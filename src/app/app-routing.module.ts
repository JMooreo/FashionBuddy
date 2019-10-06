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
    loadChildren:
      "./pages/upload/captured-image-modal/captured-image-modal.module#CapturedImageModalPageModule"
  },
  {
    path: "contest-overlay",
    loadChildren:
      "./pages/results/contest-overlay/contest-overlay.module#ContestOverlayPageModule"
  },
  {
    path: "contest-winner",
    loadChildren:
      "./pages/results/contest-winner/contest-winner.module#ContestWinnerPageModule"
  },
  {
    path: "settings",
    loadChildren: "./pages/settings/settings.module#SettingsPageModule"
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
