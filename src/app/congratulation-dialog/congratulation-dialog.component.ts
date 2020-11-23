import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskViewModel } from '../app.component';

@Component({
  selector: 'app-congratulation-dialog',
  templateUrl: './congratulation-dialog.component.html',
  styleUrls: ['./congratulation-dialog.component.scss'],
})
export class CongratulationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: TaskViewModel
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close(true);
    }, 2000);
  }
}
