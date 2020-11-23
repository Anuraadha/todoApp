import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CongratulationDialogComponent } from './congratulation-dialog/congratulation-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  task = new FormControl('', Validators.required);

  tasks: TaskViewModel[] = [];

  completedTasks: TaskViewModel[] = [];

  keywords: string[] = [];

  selectedKeywords: string[] = [];

  idCounter = 0;

  removable = true;

  constructor(
    private dialog: MatDialog,
    private matSnackBarService: MatSnackBar
  ) {}

  ngOnInit() {
    this.getDataFromLocalStorage();
  }

  getDataFromLocalStorage() {
    if (localStorage.getItem('tasks')) {
      this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    if (localStorage.getItem('completedTasks')) {
      this.completedTasks =
        JSON.parse(localStorage.getItem('completedTasks')) || [];
    }

    if (localStorage.getItem('keywords')) {
      this.keywords = JSON.parse(localStorage.getItem('keywords')) || [];
    }
    if (localStorage.getItem('selectedKeywords')) {
      this.selectedKeywords = [];
    }

    if (localStorage.getItem('idCounter')) {
      this.idCounter = JSON.parse(localStorage.getItem('idCounter')) || 0;
    }
  }

  AddTask() {
    this.fetchKeywordsAndAddTask({
      id: 0,
      name: this.task.value,
      isCompleted: false,
    });
    this.idCounter += 1;
  }

  fetchKeywordsAndAddTask(task: TaskViewModel) {
    const regex = /(#[a-z\d][\w-]*)/gi;
    let hashTags = task.name.match(regex);
    if (hashTags?.length) {
      hashTags = hashTags.map((x) => {
        return x.substring(1);
      });
      let keywordSet = new Set([...this.keywords, ...hashTags]);
      this.keywords = [...keywordSet];
    }

    if (task.id) {
      if (task.isCompleted) {
        let index = this.completedTasks.findIndex((x) => x.id == task.id);
        this.completedTasks[index].name = task.name;
      } else {
        let index = this.tasks.findIndex((x) => x.id == task.id);
        this.tasks[index].name = task.name;
      }
    } else {
      this.tasks.unshift({
        id: this.idCounter,
        name: task.name,
        isCompleted: false,
      });
    }
    this.setLocalStorage();
    this.task.setValue(null);
  }

  highlightKeyword(keyword: string) {
    if (this.selectedKeywords.includes(keyword)) {
      return true;
    }
    return false;
  }
  
  onSelectedKeyword(keyword: string) {
    if (this.selectedKeywords.includes(keyword)) {
      this.selectedKeywords = this.selectedKeywords.filter(
        (e) => e !== keyword
      );
      this.filterTasks();
    } else {
      this.selectedKeywords.push(keyword);
      this.filterTasks();
    }
    localStorage.setItem(
      'selectedKeywords',
      JSON.stringify(this.selectedKeywords)
    );
  }

  removeKeyword(keyword: string) {
    this.keywords = this.keywords.filter(function (ele) {
      return ele != keyword;
    });
    if (this.selectedKeywords.includes(keyword)) {
      this.selectedKeywords = this.selectedKeywords.filter(function (ele) {
        return ele != keyword;
      });
      this.filterTasks();
    }
  }
  filterTasks() {
    this.tasks = JSON.parse(localStorage.getItem('tasks'));

    this.completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

    if (this.selectedKeywords.length) {
      this.selectedKeywords.forEach((tag) => {
        tag = '#' + tag;

        this.tasks = this.tasks.filter(function (x) {
          return x.name.includes(tag);
        });

        this.completedTasks = this.completedTasks.filter(function (x) {
          return x.name.includes(tag);
        });
      });
    }
  }

  highlight(taskName: string) {
    const regex = /(#[a-z\d][\w-]*)/gi;
    return taskName.replace(regex, (match) => {
      return '<span class="highlightText">' + match + '</span>';
    });
  }

  onDelete(event: MouseEvent, task: TaskViewModel) {
    event.stopImmediatePropagation();
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20vw',
      height: '30vh',
      data: task,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        let sb = this.matSnackBarService.open(
          'Task has been deleted successfully....'
        );
        if (task.isCompleted) {
          this.completedTasks = this.completedTasks.filter(function (x) {
            if (x.id != task.id) return x;
          });
        } else {
          this.tasks = this.tasks.filter(function (x) {
            if (x.id != task.id) return x;
          });
        }
        setTimeout(() => {
          sb.dismiss();
        }, 2000);
        this.setLocalStorage();
      }
    });
  }

  onComplete(task: TaskViewModel) {
    const dialogRef = this.dialog.open(CongratulationDialogComponent, {
      width: '30vw',
      height: '50vh',
      data: task,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        if (!task.isCompleted) {
          task.isCompleted = true;
          this.completedTasks.unshift(task);
          this.tasks = this.tasks.filter((x) => x.id != task.id);
          this.setLocalStorage();
          return true;
        }

        return false;
      }
    });
  }

  onUpdate(event: MouseEvent, task: TaskViewModel) {
    event.stopImmediatePropagation();
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '40vw',
      height: '25vh',
      data: task.name,
    });

    dialogRef.afterClosed().subscribe((res: string) => {
      if (res) {
        let sb = this.matSnackBarService.open(
          'Task has been updated successfully....'
        );
        task.name = res;
        this.fetchKeywordsAndAddTask(task);
        setTimeout(() => {
          sb.dismiss();
        }, 2000);
      }
    });
  }

  setLocalStorage() {
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('keywords', JSON.stringify(this.keywords));
    localStorage.setItem('idCounter', JSON.stringify(this.idCounter));
    localStorage.setItem(
      'selectedKeywords',
      JSON.stringify(this.selectedKeywords)
    );
  }

  reset() {
    this.tasks = [];
    this.completedTasks = [];
    this.keywords = [];
    this.selectedKeywords = [];
    this.idCounter = 0;
    this.setLocalStorage();
    this.task.setValue(null);
  }
}

export interface TaskViewModel {
  id: number;
  name: string;
  isCompleted: boolean;
}
