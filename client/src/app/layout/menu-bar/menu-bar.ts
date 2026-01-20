import { Component, inject } from '@angular/core';
import { DashboardService } from '../../features/dashboard/services/dashboard';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'fred-menu-bar',
  imports: [MenubarModule],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBar {
  dashboardService = inject(DashboardService);
  addWidgetVisible = false;
  menuItems = [];
}
