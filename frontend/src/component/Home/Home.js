import React, { Fragment, useEffect } from 'react'
import "./Home.css"
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import {clearError, getProduct} from '../../action/productAction'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../layout/loader/Loader';
import { toast } from 'react-toastify';


const Home = () =>  {


  const dispatch = useDispatch();
  const { loading, error, products, productsCount} = useSelector( (state) =>state.products)
  console.log(products);

  useEffect(() => {
    if(error){
       toast.error(error.message);
       dispatch(clearError());
    }
    dispatch(getProduct())
  }, [dispatch, error,])

  return (
    
    <Fragment>
      {loading ? <Loader /> : 
      <Fragment>
      <MetaData title="Ecommerce"></MetaData>
        <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#featured">
              <button>
                Scroll <i className='bx bx-mouse'></i>
              </button>
            </a>
          </div>

          <h2 className="homeHeading" id='featured'>Featured Products</h2>
          <div className='container' id='container'>
           {products && products.map(product => (<ProductCard product={product} /> ))}
          </div>
          
    </Fragment>
}
    </Fragment>
  )
}

export default Home ;
