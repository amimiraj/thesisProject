import Navbar from "./Navbar";
import { useState } from "react";
import Marketplace from '../Marketplace.json';
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import axios from "axios";
  

export default function Login() {

    // if (typeof window.ethereum !== 'undefined') {
    //     window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
    
    //         if (accounts[0] == sessionStorage.getItem("account")) {
    //             window.location.replace("/marketplace")
    //         }
    //     }).catch(function (error) { console.error(error); });
    // } else {
    //     // window.location.replace("/login")
    // }




    const [formParams, updateFormParams] = useState({ userid:0, password:'' });
    const [data, updateData] = useState({});
    const [message, updateMessage] = useState('');

    const [currentAddress, updateCurrentAddress] = useState('Click here to Connect your account');
    const ethers = require("ethers");




    async function userid() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
                alert(accounts[0]);
                updateCurrentAddress(accounts[0]);
            }).catch(function (error) { console.error(error); });

        } else {
            console.error("Please install MetaMask to use this application");
        }
    }



    async function loginInformations(e) {
        e.preventDefault();
        
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)


            let userInfoURL = await contract.loginInfo(currentAddress, formParams.password);

            sessionStorage.clear();
            sessionStorage.setItem("account", currentAddress);
            sessionStorage.setItem("userUrl", userInfoURL);


            updateMessage("");
            updateFormParams({ userid:null, password: null });
            window.location.replace("/marketplace")
        }
        catch (e) {

            updateMessage("Please try with valid informations.");
          // alert(e)
        }
    }








    return (
        <div className="">
            <div className="flex flex-col place-items-center mt-10" id="nftForm">
                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">


                    <div className="mb-4">
                        <input type="" />
                    </div>

                    <h3 className="text-center font-bold text-purple-500 mb-8"> <Link to="/login">Login  </Link> / <Link to="/registration">  Registration</Link></h3>

                    <div className="mb-4">
                        <input type="" />
                    </div>


                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Your Account Address (User id) </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userid" type="button" required onClick={userid} onChange={e => updateFormParams({ ...formParams, userid: e.target.value })} value={currentAddress}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" required placeholder="Password" onChange={e => updateFormParams({ ...formParams, password: e.target.value })} value={formParams.password}></input>
                    </div>

                    <button onClick={loginInformations} className="font-bold mt-10 mb-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                        Login
                    </button>

                    <br></br>
                    <div className="text-red-600 text-center mt-3">{message}</div>

                </form>

            </div>
        </div>


    )
}
