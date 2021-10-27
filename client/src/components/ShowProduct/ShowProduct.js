import React, { useState, useEffect, render } from 'react'
import './ShowProduct.css'
import Alert from 'react-bootstrap/Alert'

import { editProduct } from '../../service/users'
import { onInputChangePluse, onInputChangeMinuse } from '../../shared/financial'
export default function ShowProduct(props) {

    useEffect(async () => {
        let Percent_MinuseOrPluse = await initializPercentMinuseOrPluse();
        setPercent(Percent_MinuseOrPluse[0])
        setMinuseOrPluse(Percent_MinuseOrPluse[1])
    }, []);

    const [Percent, setPercent] = useState("");
    const [showBotton, setShowBotton] = useState("");
    const [changePrice, setChangePrice] = useState("");
    const [minuseOrPluse, setMinuseOrPluse] = useState("");
    const [price, setPrice] = useState(parseFloat(props.price));
    const [newPrice, setnewPrice] = useState(parseFloat(props.newPrice));

    //Initialize the variables Percent and MinuseOrPluse according to the price and new price of the product
    function initializPercentMinuseOrPluse() {
        let tempNewPrice = props.newPrice
        let tempPrice = props.price
        if (tempNewPrice !== 0) {
            let percent = Math.round((tempNewPrice * 100) / tempPrice)
            if (percent > 100) {
                return [percent - 100, "הוספה"]
            }
            else {
                return [100 - percent, "הורדה"]
            }
        }
        else {
            return ["", ""];
        }

    }

    //Receives a new price and updates the price in the database
    const updatePrice = (newprice) => {
        let temp_price, temp_newPrice;
        temp_price = price;
        if (newPrice != 0) {
            temp_price = newPrice;
            setPrice(newPrice);
        }
        temp_newPrice = newprice;
        setnewPrice(newprice);
        const PriceProductDetails = {
            price: temp_price,
            newPrice: temp_newPrice
        }
        editProduct(props.id, PriceProductDetails)
        setChangePrice("");
    };
    return (
        <div className={(props.i) % 2 == 0 ? 'containeritem b1' : 'containeritem b2'}>
            <div className="supplier">{props.supplier}</div>
            <div className="newPrice">{(newPrice != 0) && ("₪ " + newPrice)}
                {((!changePrice) && Percent) &&
                    <small className="newPriceChange" >{minuseOrPluse + " (" + Percent + "%)"}</small>}
            </div>
            <div className="price">
                <button type="button" className="priceBotton" onClick={() => { if (changePrice == 0) { setShowBotton(1) } }}>₪ {price}</button>
                {showBotton && <div>
                    <button className="pluseMinuseBotton" onClick={() => { setPercent(""); setMinuseOrPluse("הורדה"); setChangePrice(1); setShowBotton(""); }}>-</button>
                    <button className="pluseMinuseBotton" onClick={() => { setPercent(""); setMinuseOrPluse("הוספה"); setChangePrice(1); setShowBotton("") }}>+</button>
                </div>}
                {changePrice && <div>
                    <input className="insertPrice " type="Number" value={Percent} placeholder={"הכנס את מס האחוזים ל" + minuseOrPluse} onChange={(event) => { if (event.target.value > 0 && (!(event.target.value > 100 && minuseOrPluse == "הורדה"))) { setPercent(parseInt(event.target.value)) } }}></input>
                    <button className="updateButton" onClick={() => {
                        let lastPrice, res
                        if (newPrice != 0) {
                            lastPrice = newPrice
                        }
                        else {
                            lastPrice = price
                        }
                        if (minuseOrPluse == "הוספה") {
                            res = onInputChangePluse(lastPrice, Percent)
                        }
                        else {
                            res = onInputChangeMinuse(lastPrice, Percent)
                        }
                        updatePrice(res);
                    }}>עדכן</button></div>}
            </div>
            <div className="Itemname">{props.name}</div>
            <div className="Barcode">{props.id}</div>
            <div className="imgdiv">  <img className="imgShow" src={props.img} /></div>

        </div>
    );
}