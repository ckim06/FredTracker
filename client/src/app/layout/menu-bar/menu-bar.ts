import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'fred-menu-bar',
  imports: [MenubarModule],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss',
})
export class MenuBar {
  addWidgetVisible = false;
  menuItems = [];
}
