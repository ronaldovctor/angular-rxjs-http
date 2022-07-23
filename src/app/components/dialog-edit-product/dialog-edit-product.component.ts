import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.scss']
})
export class DialogEditProductComponent implements OnInit {
  product: Product = {_id: '', name: '', department: '', price: 0}

  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) private p: Product
  ) 
  { 
    this.product = this.p
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close()
  }

}
