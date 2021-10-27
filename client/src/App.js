import loading from './loading.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { onInputChangePluse, onInputChangeMinuse } from './shared/financial'
import { editProduct, getAllProducts, getProductsByBarCode, getProductsBySupplier, getProductsByName } from './service/users'
import ShowProduct from './components/ShowProduct/ShowProduct'

function App() {

  const [Percent, setPercent] = useState("");
  const [showBotton, setShowBotton] = useState("");
  const [changePrice, setChangePrice] = useState("");
  const [minuseOrPluse, setMinuseOrPluse] = useState("");
  const [renderProducts, setRenderProducts] = useState(1);
  const [Products, setProducts] = useState([]);
  const [ShowProducts, setShowProducts] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [AllOrBySuppriler, setAllOrBySuppriler] = useState(null);
  const [inputSuprailetSearch, setInputSuprailetSearch] = useState("");
  const [updateBySuppriler, setUpdateBySuppriler] = useState("");
  const numProducts = Products.length

  const placeholders = {
    Barcode: "הכנס בר-קוד",
    Supplier: "הכנס שם ספק",
    Name: "הכנס שם מוצר"
  }

  let i = 0;

  useEffect(async () => {
    refreshProducts();
    let data = await getAllProducts();
    setProducts(data)
  }, []);

  //Receives a new price and product and updates the price in the database
  async function updatePrice(newprice, product) {
    let temp_price, temp_newPrice;
    temp_price = product.price;
    if (product.newPrice != 0) {
      temp_price = product.newPrice;
    }
    temp_newPrice = newprice;
    const PriceProductDetails = {
      price: temp_price,
      newPrice: temp_newPrice
    }
    await editProduct(product._id, PriceProductDetails)
  };

  //Receives a number of percentages and changes the prices of all products plus or decreasing the percentages
  function UpdatePriceAllProducts(percent) {
    setChangePrice("");
    let lastPrice
    let func
    if (minuseOrPluse == "הוספה") {
      func = onInputChangePluse
    }
    else {
      func = onInputChangeMinuse
    }
    Products.map(product => {
      if (product.newPrice != 0) {
        lastPrice = product.newPrice
      }
      else {
        lastPrice = product.price
      }
      let newPrice = func(lastPrice, percent)
      updatePrice(newPrice, product)
    })

    setTimeout(() => {
      refreshProducts()
    }, numProducts)
    setAllOrBySuppriler(null)
  }

  //Receives a number of percentages and changes the prices of all the products of the same supplier plus or decreasing the percentages
  async function UpdatePriceBySuppriler(percent) {
    let lastPrice
    let func
    if (minuseOrPluse == "הוספה") {
      func = onInputChangePluse
    }
    else {
      func = onInputChangeMinuse
    }
    let data = await getProductsBySupplier(updateBySuppriler);
    if (typeof data == 'object') {
      data.map(product => {
        if (product.newPrice != 0) {
          lastPrice = product.newPrice
        }
        else {
          lastPrice = product.price
        }
        let newPrice = func(lastPrice, percent)
        updatePrice(newPrice, product)
      })
      refreshProducts()
    }
    else {
      alert(data);
    }
    setUpdateBySuppriler("")
    setAllOrBySuppriler(null)
  }

  //Refreshes the price view according to the database
  async function refreshProducts() {
    setRenderProducts(0)
    let data = await getAllProducts();
    setShowProducts(data)
    setSearchBarcode("")
    setSearchName("")
    setSearchSupplier("")
    setRenderProducts(1)

  }

  //Returns the products of the same supplier by reading from the database
  async function SrearchProductsBySupplier() {
    let data = await getProductsBySupplier(searchSupplier);
    if (typeof data == 'object') {
      setRenderProducts(0);
      setShowProducts(data);
      setRenderProducts(1);
    }
    else {
      alert(data);
    }
  }

  //Returns the product with the search bar code by reading from the database
  async function SrearchProductsByBarCode() {
    let data = await getProductsByBarCode(searchBarcode);
    if (typeof data == 'object') {
      setShowProducts(data);
    }
    else {
      alert(data);
    }
  }

  //Returns the product with the search name by reading from the database
  async function SrearchProductsByName() {
    let data = await getProductsByName(searchName);
    if (typeof data == 'object') {
      setShowProducts(data);
    }
    else {
      alert(data);
    }

  }

  //Auxiliary function-check if user clear input and refresh screen
  function isStopSearch(valueSearch) {
    if (valueSearch == "") {
      refreshProducts()
    }
  }

  return (
    <div>
      <header className="App-header">
        <div className="label">פאנל ניהול</div>
        <div className="ChangePrice">
          <div className="bottonsChangePriceContainer">
            <button className={AllOrBySuppriler ? "bottonsChangePrice button3" : "bottonsChangePrice updateButton"} onClick={() => { if (!changePrice && !inputSuprailetSearch) { setShowBotton(1); } setAllOrBySuppriler(1) }}>עדכון מחיר לכל המוצרים</button>
          </div>
          <div className={changePrice || inputSuprailetSearch || showBotton ? "updatePrice" : ""}>
            {showBotton && <div>
              <button className="pluseMinuseBotton1" onClick={() => { setPercent(""); setMinuseOrPluse("הורדה"); setChangePrice(1); setShowBotton(""); }}>-</button>
              <button className="pluseMinuseBotton1" onClick={() => { setPercent(""); setMinuseOrPluse("הוספה"); setChangePrice(1); setShowBotton("") }}>+</button>
            </div>}
            {changePrice && <div>
              <input className="AppInsertPrice" type="Number" value={Percent} placeholder={"הכנס את מס האחוזים ל" + minuseOrPluse} onChange={(event) => { if (event.target.value > 0) { setPercent(parseInt(event.target.value)) } }}></input>
              <button className="updateButton" onClick={() => { if (AllOrBySuppriler == 1) { UpdatePriceAllProducts(Percent) } else { setInputSuprailetSearch(1); setChangePrice(""); } }}>עדכן</button></div>
            }
            {inputSuprailetSearch && <input className="inputUpdateBySuppriler"
              name="supplier"
              value={updateBySuppriler}
              onKeyDown={(event) => { if (event.key == "Enter") { UpdatePriceBySuppriler(Percent); setInputSuprailetSearch("") } }}
              onChange={(event) => { setUpdateBySuppriler(event.target.value); }}
              placeholder={placeholders.Supplier} />
            }

          </div>
          <div className="bottonsChangePriceContainer">
            <button className={AllOrBySuppriler == 0 ? "bottonsChangePrice button3" : "bottonsChangePrice updateButton"} onClick={() => { if (!changePrice && !inputSuprailetSearch) { setShowBotton(1); } setAllOrBySuppriler(0) }}>עדכון מחיר לפי ספק</button>
          </div>
        </div>
        <div className="bottonsSerch">
          <button className="inputSearch buttonShowAllProduct" onClick={() => { refreshProducts(); }}>הצגת כל המוצרים</button>

          <input className="inputSearch"
            name="barcode"
            value={searchBarcode}
            onKeyDown={(event) => { if (event.key == "Enter") { SrearchProductsByBarCode(); } }}
            onChange={(event) => { setSearchBarcode(event.target.value); isStopSearch(event.target.value); }}
            placeholder={placeholders.Barcode} />

          <label className="labels">חיפוש לפי שם</label>

          <input className="inputSearch"
            name="name"
            value={searchName}
            onKeyDown={(event) => { if (event.key == "Enter") { SrearchProductsByName(); } }}
            onChange={(event) => { setSearchName(event.target.value); isStopSearch(event.target.value); }}
            placeholder={placeholders.Name} />

          <label className="labels">חיפוש לפי ספק</label>

          <input className="inputSearch"
            name="supplier"
            value={searchSupplier}
            onKeyDown={(event) => { if (event.key == "Enter") { SrearchProductsBySupplier(); } }}
            onChange={(event) => { setSearchSupplier(event.target.value); isStopSearch(event.target.value); }}
            placeholder={placeholders.Supplier} />

          <label className="labels">חיפוש לפי בר-קוד</label>
        </div>
        <div className="products">
          <div className="category">
            <div className="titleSupplier">ספק</div><div className="title">מחיר חדש</div><div className="title">מחיר</div><div className="title">שם פריט</div><div className="title">בר קוד</div><div className="title" className="title">תמונה</div>
          </div>
          <div className="containerViewProduct">
            {renderProducts && ShowProducts.map(Product => {
              i += 1;
              return (<ShowProduct className="border" i={i} id={Product._id} newPrice={Product.newPrice} price={Product.price}
                name={Product.name} img={Product.image} supplier={Product.supplier} />)
            })}
          </div>
        </div>
        {!renderProducts && <img src={loading} className="App-logo" alt="logo" />}
        <p>
          Developed by Sara Gino.
        </p>
      </header>
    </div>
  );
}

export default App;
