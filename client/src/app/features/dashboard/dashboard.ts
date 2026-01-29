import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FredTable } from './widgets/table/table';
import { FredText } from './widgets/text/text';
import { BaseWidget, WidgetTitle, WidgetBody } from './widgets/widget/widget';
import { DialogModule } from 'primeng/dialog';
import { WidgetForm } from '../widget-form/widget-form';
import { ButtonModule } from 'primeng/button';
import { Widget } from '@models';
import { WigetsService, LayoutService } from '@services';
import { ToastModule } from 'primeng/toast';
import { FredGraph } from './widgets/graph/graph';
import { MessageService } from 'primeng/api';
import { FredChat } from '../chat/chat';
import { PopoverModule } from 'primeng/popover';
@Component({
  selector: 'fred-dashboard',
  imports: [
    CommonModule,
    FredGraph,
    FredTable,
    FredText,
    BaseWidget,
    ProgressSpinnerModule,
    WidgetTitle,
    WidgetBody,
    DialogModule,
    ButtonModule,
    WidgetForm,
    ToastModule,
    FredChat,
    PopoverModule,
  ],
  providers: [MessageService],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly wigetsService = inject(WigetsService);
  private readonly layoutService = inject(LayoutService);
  private readonly messageService = inject(MessageService);
  readonly widgets = this.wigetsService.widgets;

  readonly text = computed(() => this.widgets.value().filter((w) => w.type === 'text'));
  readonly graphs = computed(() => this.widgets.value().filter((w) => w.type === 'graph'));
  readonly tables = computed(() => this.widgets.value().filter((w) => w.type === 'table'));

  editingWidget = this.layoutService.editingWidget;
  showWidgetForm = this.layoutService.showWidgetForm;
  modalHeader = this.layoutService.modalHeader;

  onWidgetSubmit(widget: Widget) {
    this.wigetsService.submitWidget(widget).subscribe({
      complete: () => {
        this.layoutService.closeModal();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error submitting the widget.',
        });
        console.error('Error submitting widget:', error);
      },
    });
  }

  onWidgetEdit(widget: Widget) {
    this.layoutService.openEditModal(widget);
  }

  onWidgetDelete(widget: Widget) {
    if (widget.id) {
      this.wigetsService.deleteWidget(widget.id).subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Widget deleted successfully.',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error deleting the widget.',
          });
          console.error('Error deleting widget:', error);
        },
      });
    }
  }

  openAddWidgetModal() {
    this.layoutService.openAddModal();
  }
}
