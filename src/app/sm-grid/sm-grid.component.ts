import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GridData } from '../common-interface';
import { SmFormComponent } from '../sm-form/sm-form.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sm-grid',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, SmFormComponent, CommonModule],
  templateUrl: './sm-grid.component.html',
  styleUrl: './sm-grid.component.scss'
})
export class SmGridComponent implements OnInit {
  public gridColumns: string[] = ['name', 'gender', 'course', 'hobbies', 'city', 'actions'];
  public gridData!: MatTableDataSource<GridData>;
  public editingIndex: number = -1;
  public studentData!: GridData;
  public showForm: boolean = false;

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
    this.editingIndex = -1;
    this.showForm = true;
  }

  editStudent(index: number) {
    this.studentData = this.gridData.data[index];
    this.editingIndex = index;
    this.showForm = true;
  }

  deleteStudent(index: number) {
    this.gridData.data = this.gridData.data.filter((_, i) => i !== index);
    this.setGridData();
  }

  formUpdated(formValue: GridData) {
    if (this.editingIndex >= 0) {
      this.gridData.data[this.editingIndex] = formValue;
      this.gridData.data = [...this.gridData.data];
    } else {
      this.gridData.data = [...this.gridData.data, formValue];
    }
    this.setGridData();
  }

  private setGridData() {
    localStorage.setItem('gridData', JSON.stringify(this.gridData.data));
    this.editingIndex = -1;
    this.showForm = false;
  }
}
