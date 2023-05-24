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


function MarketNavbar({ setSearchValue }) {

    // if (typeof window.ethereum !== 'undefined') {
    //     window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

    //         if (accounts[0] != sessionStorage.getItem("account")) {
    //             window.location.replace("/")
    //         }

    //     }).catch(function (error) { console.error(error); });
    // } else {
    //     window.location.replace("/")
    // }


    const [input, setInput] = useState('');

    async function viewIteams() {
        setSearchValue(input);
    }

    async function login() {
        window.location.replace("/login")

    }

    async function logout() {
        sessionStorage.clear();
        window.location.replace("/login")
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


                    <li className='flex items-end ml-5 pb-2'>
                        <input type="search" className='bg-transparent border-2 w-80 border-solid border-neutral-300 text-white rounded p-0 shadow-lg pr-0' placeholder="Token Number."
                            onChange={e => setInput(e.target.value)} value={input} />
                        <button className="enableEthereumButton bg-purple-600 hover:bg-purple-800 text-white font-bold py-1 px-4 rounded text-sm" onClick={viewIteams} >SEARCH</button>
                    </li>



                    <li className='w-2/6'>
                        <ul className='lg:flex justify-between font-bold mr-10 text-lg'>

                            <li className='hover:border-b-2 hover:pb-0 p-2'><Link to="/marketplace">Marketplace</Link></li>
                            <li className='hover:border-b-2 hover:pb-0 p-2 selected'><Link to="/sellNFT">Create a NFT</Link></li>
                            <li className='hover:border-b-2 hover:pb-0 p-2'><Link to="/profile">Profile</Link></li>
                            <li>
                                {(sessionStorage.getItem("account")==null)? 
                                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={login}>Login</button>
                                :<button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={logout}>Logout</button>

                            }
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default MarketNavbar;