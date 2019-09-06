import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'voting',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../voting/voting.module').then(m => m.VotingPageModule)
          }
        ]
      },
      {
        path: 'upload',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../upload/upload.module').then(m => m.UploadPageModule)
          }
        ]
      },
      {
        path: 'results',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../results/results.module').then(m => m.ResultsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/voting',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/voting',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
