import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

export default function Registration() {

    // const [formParams, updateFormParams] = useState({ name: 'Miraj', nid: '123',dob:'', phone: '369', presentAddress: 'Mirpur', permanentAddress: 'Faridpur',userid: 'Connect Your wallet', password:'' });
    const [formParams, updateFormParams] = useState({ name: '', nid: '',dob:'', phone: '', presentAddress: '', permanentAddress: '',userid: 'Connect Your wallet', password:'' });

    // const [fileURL, setFileURL] = useState("noURL");
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [currentAddress, updateCurrentAddress] = useState('Click here to Connect your account');
    const location = useLocation();



    //This function uploads the metadata to IPFS
    async function uploadUserdataToIPFS() {

        const { name, nid, dob, phone, presentAddress, permanentAddress,  userid, password } = formParams;

        //Make sure that none of the fields are empty
        if (!name || !nid || !dob || !phone || !presentAddress || !permanentAddress || !userid || !password){
            alert("Invalid informations !")
         return 1;
        }

        const nftJSON = {
            name, nid,dob, phone, presentAddress, permanentAddress, userid, password
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);

            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }


    async function uploadInformations(e) {

        e.preventDefault();

        try {

            //Upload data to IPFS
            const metadataURL = await uploadUserdataToIPFS();
            if(metadataURL==1)return;

            alert("Your Informations are valid, please click okay for the next procedure.")

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            updateMessage("Please wait.. uploading the information")


            let balance = await signer.getBalance();

            let transaction = await contract.addUser(balance, currentAddress, formParams.password, metadataURL);
            await transaction.wait();

            alert("Successfully registration done.");
            updateMessage("");
            updateFormParams({ name: '', nid: '',dob:'', phone: '', presentAddress: '', permanentAddress: '', additionalinfo: '', userid: '', password:'' });
            window.location.replace("/login")
        }

        catch (e) {
            console.log(e)
            alert("Something Went Wrong. Please try again !")
        }
    }



    async function userid() {

        if (typeof window.ethereum !== 'undefined') {

            window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
                alert(accounts[0]);
                updateCurrentAddress(accounts[0]);
            }).catch(function (error) { console.error(error); });

        } else {
            // If Web3 is not available, display an error message
            alert("Please install MetaMask to use this application");
        }

    }

    return (
        <div className="">

            <div className="flex flex-col place-items-center mt-10" id="nftForm">

                <form className="bg-white shadow-md rounded px-10 pt-4 pb-8 mb-4">

                    <h3 className="text-center font-bold text-purple-500 mb-8"> <Link to="/login">Login  </Link> / <Link to="/registration">  Registration</Link></h3>


                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Your Full Name:</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Your NID number:</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nid" type="text" placeholder="" onChange={e => updateFormParams({ ...formParams, nid: e.target.value })} value={formParams.nid}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Birth of Date:</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dob" type="date"  onChange={e => updateFormParams({ ...formParams, dob: e.target.value })} value={formParams.dob}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Phone Number</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, phone: e.target.value })} value={formParams.phone}></input>
                    </div>

                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Present Address</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="presentAddress" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, presentAddress: e.target.value })} value={formParams.presentAddress}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Permanent Address</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="permanentAddress" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, permanentAddress: e.target.value })} value={formParams.permanentAddress}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Your Account Address (User id) </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userid" type="button" onClick={userid} onChange={e => updateFormParams({ ...formParams, userid: e.target.value })} value={currentAddress}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" onChange={e => updateFormParams({ ...formParams, password: e.target.value })} value={formParams.password}></input>
                    </div>

                    <br></br>
                    <div className="text-green text-center">{message}</div>
                    <button onClick={uploadInformations} className="font-bold mt-5 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                        CREATE ACCOUNT
                    </button>
                </form>
            </div>
        </div>
    )
}
