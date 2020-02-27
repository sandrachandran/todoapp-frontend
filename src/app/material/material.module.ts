import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule,  MatToolbarModule , MatCardModule,MatDialogModule, MatStepperModule,MatInputModule, MatFormFieldModule, MatIconModule, MatTabsModule, MatListModule, MatExpansionModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule} from '@angular/material';

const Materials = [MatButtonModule,MatToolbarModule,MatCardModule,MatDialogModule,MatStepperModule,MatInputModule,MatFormFieldModule,MatIconModule,MatTabsModule,MatListModule,MatExpansionModule,MatCheckboxModule,MatMenuModule,MatProgressSpinnerModule]
@NgModule({
  declarations: [],
  imports: [
    Materials
  ],
  exports:[
    Materials
  ]
})
export class MaterialModule { }
