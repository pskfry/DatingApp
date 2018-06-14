import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        { path: 'member-list', component: MemberListComponent, resolve: { users: MemberListResolver } },
        { path: 'lists', component: ListsComponent },
        { path: 'messages', component: MessagesComponent },
        { path: 'member/:id', component: MemberDetailComponent, resolve: { user: MemberDetailResolver } }
      ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
