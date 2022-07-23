import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { filter, mergeMap, Observable, switchMap } from 'rxjs';
import { DialogEditProductComponent } from './components/dialog-edit-product/dialog-edit-product.component';
import { Product } from './models/Product';
import { ProductsService } from './services/products.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-client';
  simpleReqProductObs$: Observable<Product[]> = new Observable()
  productsErrorhandling: Product[] = []
  productsLoading: Product[] = []
  matLoading?: boolean
  productsIds: Product[] = []
  newlyProducts: Product[] = []
  productsToDelete: Product[] = []
  productsToEdit: Product[] = []

  constructor(private productsService: ProductsService,
     private snackBar: MatSnackBar,
     private dialog: MatDialog){
  }

  ngOnInit(): void {
  }

  getSimpleHttpRequest(): void {
    this.simpleReqProductObs$ = this.productsService.getProducts()
  }

  getProductsErrorHandling(): void {
    this.productsService.getProductsError().subscribe({
      next: (prods) => this.productsErrorhandling = prods,
      error: (err) => {
        console.log(err)
        console.log(`Message: ${err.error.msg}`)
        console.log(`Status code: ${err.status}`)
        let config = new MatSnackBarConfig()
        config.duration = 2000
        config.panelClass = ['snack-error']

        if(err.status == 0)
          this.snackBar.open('Could not connect to the server', '', config)
        else
          this.snackBar.open(err.error.msg, '', config)
      }
    })
  }

  getProductsErrorHandlingOK(): void {
    this.productsService.getProductsDelay().subscribe({
      next: (prods) => {
        this.productsErrorhandling = prods
        let config = new MatSnackBarConfig()
        config.duration = 2000
        config.panelClass = ['snack-ok']
          this.snackBar.open('Products successfuly loaded!', '', config)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getProductsLoading(): void {
    this.matLoading = true
    this.productsService.getProductsDelay().subscribe({
      next: (prods) => {
        this.productsLoading = prods
        this.matLoading = false
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getProductsIds(): void {
    this.productsService.getProductsIds().subscribe((ids) => {
      this.productsIds = ids.map(id => ({_id: id, name: '', department: '', price: 0}))
    })
  }

  loadName(id: string): void {
    this.productsService.getProductsName(id).subscribe((prodName) => {
      {
        let index = this.productsIds.findIndex(p => p._id == id)
        if (index >= 0){
          this.productsIds[index].name = prodName
        }
      }
    })
  }

  saveProduct(name: string, department: string, price: number){
    let p = {name, department, price}
    this.productsService.saveProduct(p).subscribe({
      next: (prod: Product) => {
        console.log(prod)
        this.newlyProducts.push(prod)
      },
      error: (err) => {
        console.log(err)
        let config = new MatSnackBarConfig()
        config.duration = 2000
        config.panelClass = ['snack-err']

        if(err.status == 0)
          this.snackBar.open('Could not connect to the server', '', config)
        else
          this.snackBar.open(err.error.msg, '', config)
      }
    })
  }

  ConvertToNumber(value: any): number {
    let result = Number(value)
    if(result)
      return result
    return 0
  }

  loadProductsToDelete(){
    this.productsService.getProducts().subscribe(prods => {
      this.productsToDelete = prods
    })
  }

  deleteProduct(p: Product) {
    this.productsService.deleteProduct(p).subscribe({
      next: (res) => {
        let i = this.productsToDelete.findIndex(x => x._id == p._id)
        if(i>0)
          this.productsToDelete.splice(i, 1)
      },
      error: (err) => console.log(err)
    })
  }

  loadProductsToEdit(): void {
    this.productsService.getProducts().subscribe(prods => {
      this.productsToEdit = prods
    })
  }

  editProduct(p: Product): void {
    let newProduct: Product = {...p}
    let dialogRef = this.dialog.open(DialogEditProductComponent, {
      width: '400px', 
      data: newProduct
    })

    // dialogRef.afterClosed().subscribe(
    //   (res) => {
    //     if(res){
    //       this.productsService.updateProduct(res)
    //       .subscribe({
    //         next: () => {
    //           let i = this.productsToEdit.findIndex(x => x._id == p._id)
    //           if(i>=0)
    //             this.productsToEdit[i] = res
    //         },
    //         error: (err) => {
    //           console.error (err)
    //         }
    //       })
    //     }
    //   }
    // )

    dialogRef.afterClosed().pipe(
      filter((prod: Product) => prod != undefined),
      switchMap((res:Product) => this.productsService.updateProduct(res))
    ).subscribe({
      next: (prod: Product) => {
        let i = this.productsToEdit.findIndex(x => x._id == p._id)
        if(i>=0)
          this.productsToEdit[i] = prod
      },
      error: (err) => {
        console.error (err)
      }
    })
  }
}
