import React from 'react'
import appStore from './Appstore.png'
import playStore from './playstore.png'
import './Footer.css'
function Footer() {
  return (
    <div id='footer'>
        <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>download App for Android and IOS.</p>
            <img src={appStore} alt="png"></img>
            <img src={playStore} alt="png"></img>
            

        </div>
        <div className='midFooter'>
            <h1>street style</h1>
            <p>High Quality is our first priority</p>
            <p>copyrights 2022 &copy; Vikash</p>

        </div>
        <div className='rightFooter'>
        <h4>Follow Us</h4>
        <a href="/">Instagram</a>
        <a href="/">Youtube</a>
        <a href="/">Facebook</a>
        </div>
    </div>
  )
}

export default Footer
