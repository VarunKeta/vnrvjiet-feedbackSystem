import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./product.css";
function Product() {
  let { state } = useLocation();
  return (
    <div className="Container  bg-light m-5 p-2">
      <div className="cont1">
        <div className="subcont1">
          <img src={state.image} alt="" width={"250px"} height={"250px"} />
        </div>
        <div className="subcont2">
          <h3>{state.title}</h3>
          <h5 className="about">About</h5>
          <p className="des">{state.description}</p>
          <h3 className="price">${state.price}</h3>
          <h3 className=" stock text-success">In Stock</h3>
          <p className="rate">
            rating: {state.rating.rate}({state.rating.count})
          </p>
          <div className="ssubcont">
            <button className="btn btn-warning m-3" type="button">
              Buy Now
            </button>
            <button className="btn btn-warning m-2" type="button">
              Add to Cart
            </button>
          </div>
          <button className="btn btn-info m-3" type="button">
            Add to wishlist (-_-)
          </button>
        </div>
      </div>
      <div class="endbut ">
        <Link to="/" className="link p-1 mx-2">
          <button className="btn btn-warning" type="button">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
export default Product;
