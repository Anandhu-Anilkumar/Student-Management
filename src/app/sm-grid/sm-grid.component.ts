import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GridData } from '../common-interface';
import { SmFormComponent } from '../sm-form/sm-form.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-sm-grid',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './sm-grid.component.html',
  styleUrl: './sm-grid.component.scss'
})
export class SmGridComponent implements OnInit {
  public gridColumns: string[] = ['name', 'gender', 'course', 'hobbies', 'city', 'actions'];
  public gridData!: MatTableDataSource<GridData>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (localStorage.getItem('gridData')) {
      this.gridData = new MatTableDataSource(JSON.parse(localStorage.getItem('gridData')!));
    } else {
      this.gridData = new MatTableDataSource([
        { name: 'Arun', gender: 'Male', course: 'Commerce', city: 'Kochi', hobbies: ['Sports'] },
        { name: 'Bharathi', gender: 'Female', course: 'Arts', city: 'Mumbai', hobbies: ['Reading', 'Music'] }
      ]);
    }
  }

  createStudent() {
    const dialogRef = this.dialog.open(SmFormComponent, {
      width: '500px',
      data: {
        studentData: {
          name: '',
          gender: '',
          course: '',
          hobbies: [],
          city: ''
        },
        editingIndex: -1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data) {
        this.gridData.data = [...this.gridData.data, result.data];
        this.setGridData();
      }
    });
  }

  editStudent(index: number) {
    const dialogRef = this.dialog.open(SmFormComponent, {
      width: '500px',
      data: {
        studentData: {
          name: this.gridData.data[index].name,
          gender: this.gridData.data[index].gender,
          course: this.gridData.data[index].course,
          hobbies: [...this.gridData.data[index].hobbies],
          city: this.gridData.data[index].city
        },
        editingIndex: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data) {
        this.gridData.data = this.gridData.data.map((item: GridData, i: number) =>
          i === result.editingIndex ? result.data : item
        );
        this.setGridData();
      }
    });
  }

  deleteStudent(index: number) {
    this.gridData.data = this.gridData.data.filter((_: GridData, i: number) => i !== index);
    this.setGridData();
  }

  private setGridData() {
    localStorage.setItem('gridData', JSON.stringify(this.gridData.data));
  }
}
