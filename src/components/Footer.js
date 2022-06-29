import React from 'react'
import './Footer.css'

export default () => (
  <div>
    {/* <h2 className="taCenter">
      <a className="socialLink" href="https://instagram.com/sal_eigh/" target="_blank" rel="noreferrer">@sal_eigh</a>
    </h2> */}
    <h3 className="taCenter">
      <span className="email">jodegousee@gmail.com</span>
    </h3>
    <br />
    <footer className="footer">
      <div className="container taCenter">
        <span>
          © Copyright {new Date().getFullYear()} Jonathan Degousée. All rights reserved. Crafted by{' '}
          <a href="https://thriveweb.com.au/" target="_blank" rel="noreferrer">Thrive</a>.
        </span>
      </div>
    </footer>
  </div>
)
