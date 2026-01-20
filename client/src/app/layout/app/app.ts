import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FredHeader } from '../header/header';
import { MenuBar } from '../menu-bar/menu-bar';
import { FredFooter } from '../footer/footer';

@Component({
  selector: 'fred-root',
  imports: [RouterOutlet, FredHeader, MenuBar, FredFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
