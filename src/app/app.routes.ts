import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // 🔁 Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔓 PUBLIC
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // 🔐 PROTECTED APP
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/navbar/navbar.component').then(m => m.NavbarComponent),
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./dashboard/home/home.component').then(m => m.HomeComponent)
      },

      {
        path: 'expenses',
        loadComponent: () =>
          import('./expenses/list/list.component').then(m => m.ListComponent)
      },

      {
        path: 'add-expense',
        loadComponent: () =>
          import('./expenses/form/form.component').then(m => m.FormComponent)
      },

      {
        path: 'edit-expense/:id',
        loadComponent: () =>
          import('./expenses/form/form.component').then(m => m.FormComponent)
      },
       {
         path: 'profile',
         loadComponent: () =>
           import('./profile/profile.component').then(m => m.ProfileComponent)
     },
     {
  path: 'change-password',
  loadComponent: () =>
    import('./profile/change-password/change-password.component').then(m => m.ChangePasswordComponent)
},    

    ]
  },

  // ❗ fallback
  { path: '**', redirectTo: 'login' }
];
