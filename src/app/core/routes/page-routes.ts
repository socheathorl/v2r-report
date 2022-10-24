import { Routes } from "@angular/router";

export const PageRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import("../../features/dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import("../../features/transactions/transactions.module").then(m => m.TransactionsModule)
  },
  {
    path: 'cloud',
    loadChildren: () =>
      import("../../features/cloud/cloud.module").then(m => m.CloudModule)
  }
];
