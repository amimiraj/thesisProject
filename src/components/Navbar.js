import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';



function Navbar() {


  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

      if (accounts[0] != sessionStorage.getItem("account")) {
        window.location.replace("/login")
      }

    }).catch(function (error) { console.error(error); });
  } else {
    window.location.replace("/login")
  }



  async function logout() {
    sessionStorage.clear();
    window.location.replace("/")

  }



  return (


    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>

          <li className='flex items-end ml-5 pb-2'>
            <Link to="/marketplace">
              <div className='inline-block font-bold text-xl ml-2'>
                Apartment Marketplace
              </div>
            </Link>
          </li>

          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>

              <li className='hover:border-b-2 hover:pb-0 p-2'><Link to="/marketplace">Marketplace</Link></li>
              <li className='hover:border-b-2 hover:pb-0 p-2 selected'><Link to="/sellNFT">Create a NFT</Link></li>
              <li className='hover:border-b-2 hover:pb-0 p-2'><Link to="/profile">Profile</Link></li>
              <li><button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={logout}>Logout</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;