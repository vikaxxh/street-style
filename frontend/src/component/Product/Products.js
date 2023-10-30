import React, { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearError, getProduct } from "../../action/productAction";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/loader/Loader";
import "./Products.css"
import Pagination from 'react-js-pagination'
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider";
import {toast} from 'react-toastify'
import MetaDate from '../layout/MetaData'


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

function Products() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0 , 25000])
  const [category, setCategory] = useState("")
  const [ratings, setRatings] = useState(0)

  const { products, loading, error, productsCount , resultPerPage } = useSelector((state) => state.products);

  const priceHandler = (event, newPrice) =>{
   setPrice(newPrice)
  }

  const {keyword} = useParams();

  const setCurrentPageNo = (e) =>{
    setCurrentPage(e)
  }

  useEffect(() => {
    if(error){
      toast.error(error)
      dispatch(clearError())
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

 
  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaDate title="Products--ecom" />
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page_link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Products;
