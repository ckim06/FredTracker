import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Widget } from '@models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule, MenubarPassThrough } from 'primeng/menubar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FredText } from '../text/text';
import { FredTable } from '../table/table';
import { FredGraph } from '../graph/graph';

@Component({
  selector: 'fred-widget',
  imports: [CardModule, ButtonModule, MenubarModule, ConfirmDialog, FredGraph, FredTable, FredText],
  providers: [ConfirmationService, MessageService],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseWidget {
  editClick = output<Widget>();
  deleteClick = output<Widget>();
  widget = input.required<Widget>();
  items = [
    { icon: 'pi pi-pencil', command: () => this.editClick.emit(this.widget()) },
    { icon: 'pi pi-trash', command: () => this.confirmDelete(this.widget()) },
  ];
  widgetMenu: MenubarPassThrough = {
    root: {
      class: 'widget-menu-root',
    },
    rootList: {
      style: 'flex-wrap: nowrap;',
    },
  };
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  confirmDelete(widget: Widget) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the widget "${widget.title}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.deleteClick.emit(widget);
        this.messageService.add({
          severity: 'info',
          summary: 'Widget Deleted',
          detail: `The widget "${widget.title}" has been deleted.`,
        });
      },
    });
  }
}
