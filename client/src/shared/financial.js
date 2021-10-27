   //Returns num 'x' 2 digits after the dot.
   function financial(x){
    return Number.parseFloat(x).toFixed(2);
}
  //Receives last price and percent calculates the new price- last price plus the percentage and returns it.
  export const onInputChangePluse=(lastPrice, percent) =>{
    let newprice = parseFloat(lastPrice) + ((lastPrice * (percent)) / 100)
    return financial(newprice)
  }
  //Receives last price and percent calculates the new price- last price decreasing the percentage and returns it.
  export const onInputChangeMinuse=(lastPrice, percent)=> {
    let newprice = parseFloat(lastPrice) - ((lastPrice * (percent)) / 100)
    return financial(newprice)

  }