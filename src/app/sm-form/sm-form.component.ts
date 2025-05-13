import { Component, EventEmitter, Inject, Input, OnInit, Output, Optional } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GridData } from '../common-interface';

@Component({
  selector: 'app-sm-form',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './sm-form.component.html',
  styleUrl: './sm-form.component.scss'
})
export class SmFormComponent implements OnInit {
  @Input() editingIndex: number = -1;
  @Input() studentData?: GridData;
  @Output() formUpdated = new EventEmitter<GridData>();

  public studentForm!: FormGroup;
  public filteredOptions!: Observable<string[]>;
  public courses: string[] = ['Science', 'Commerce', 'Arts'];
  public hobbies: string[] = ['Reading', 'Sports', 'Music'];
  public cities: string[] = ['Kochi', 'Delhi', 'Mumbai'];
  public isDialog: boolean = false;

  constructor(
    private _fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<SmFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { studentData: GridData; editingIndex: number }
  ) {
    this.isDialog = !!dialogRef;
    if (this.isDialog && data) {
      this.studentData = data.studentData;
      this.editingIndex = data.editingIndex;
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.studentData) {
      this.updateFormValues(this.studentData);
    }
    this.handleAutoComplete();
  }

  private updateFormValues(data: GridData): void {
    this.studentForm.reset();
    Object.keys(data).forEach(key => {
      const value = data[key as keyof GridData];
      if (key === 'hobbies') {
        this.studentForm.get(key)?.setValue([...value]);
      } else {
        this.studentForm.get(key)?.setValue(value);
      }
    });
  }

  private initForm(): void {
    this.studentForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      gender: ['', Validators.required],
      course: ['', Validators.required],
      hobbies: [[]],
      city: ['', Validators.required]
    });
  }

  private handleAutoComplete(): void {
    this.filteredOptions = this.studentForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const filterValue = value ? value.toLowerCase() : '';
        return this.cities.filter((option: string) => 
          option.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  hobbyCheckboxSelection(checkedStatus: boolean, hobby: string): void {
    const currentHobbies = [...(this.studentForm.get('hobbies')?.value || [])];
    if (checkedStatus) {
      if (!currentHobbies.includes(hobby)) {
        currentHobbies.push(hobby);
      }
    } else {
      const index = currentHobbies.indexOf(hobby);
      if (index > -1) {
        currentHobbies.splice(index, 1);
      }
    }
    this.studentForm.patchValue({ hobbies: currentHobbies });
  }

  onCitySelected(event: MatAutocompleteSelectedEvent): void {
    this.studentForm.patchValue({ city: event.option.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.studentForm.valid) {
      const formValue: GridData = {
        name: this.studentForm.get('name')?.value,
        gender: this.studentForm.get('gender')?.value,
        course: this.studentForm.get('course')?.value,
        hobbies: [...(this.studentForm.get('hobbies')?.value || [])],
        city: this.studentForm.get('city')?.value
      };
      
      if (this.isDialog) {
        this.dialogRef.close({ data: formValue, editingIndex: this.editingIndex });
      } else {
        this.formUpdated.emit(formValue);
      }
    }
  }
}
