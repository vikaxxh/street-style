import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import {  Route , useNavigate} from 'react-router-dom';


function ProtectedRoute({element: Element, ...rest}) {
    const navigate = useNavigate()
    const [loading, isAuthenticated, user] = useSelector(state => state.user)
  return (
   <Fragment>
       
   </Fragment>
  );
}

export default ProtectedRoute
