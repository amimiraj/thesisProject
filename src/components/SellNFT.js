import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";

export default function SellNFT() {



    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

            if (accounts[0] != sessionStorage.getItem("account")) {
                window.location.replace("/login")
            }

        }).catch(function (error) { console.error(error); });
    } else {
        window.location.replace("/login")
    }


    // const [formParams, updateFormParams] = useState({ country: 'Bangladesh', division: 'Dhaka', district: 'Dhaka', thana: 'Mirpur', mauzo: 'mirpur-1', dag: '711', khatian: '720', house_no: '201', flat_no: '4A', type: '1', price: '0.01' });
    const [formParams, updateFormParams] = useState({ country: '', division: '', district: '', thana: '', mauzo: '', dag: '', khatian: '', house_no: '', flat_no: '', type: '1', price: '' });

    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();



    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {

        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { country, division, district, thana, mauzo, dag, khatian, house_no, flat_no, type, price } = formParams;
        //Make sure that none of the fields are empty
        if (!country || !division || !district || !thana || !mauzo || !dag || !khatian || !house_no || !flat_no || !type || !price || !fileURL)
            return;

        const nftJSON = {
            country, division, district, thana, mauzo, dag, khatian, house_no, flat_no, type, price, image: fileURL
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

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();

            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether');
            const type = parseInt(formParams.type);


            let balance = await signer.getBalance();

            //actually create the NFT  
            let transaction = await contract.createToken(balance, metadataURL, type, price);
            await transaction.wait();

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ country: '', division: '', district: '', thana: '', mauzo: '', dag: '', khatian: '', house_no: '', flat_no: '', type: '', price: '' });
            window.location.replace("/")
        }
        catch (e) {
            console.log(e);
            alert(" " + e)
        }
    }

    console.log("Working", process.env);


    return (
        <div className="">

            <Navbar></Navbar>

            <div className="flex flex-col place-items-center mt-10" id="nftForm">

                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
                    <h3 className="text-center font-bold text-purple-500 mb-8">Give your Apartment details to the marketplace</h3>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Country</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Bangladesh" onChange={e => updateFormParams({ ...formParams, country: e.target.value })} value={formParams.country}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Division</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="division" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, division: e.target.value })} value={formParams.division}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">District</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="district" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, district: e.target.value })} value={formParams.district}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Thana</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="thana" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, thana: e.target.value })} value={formParams.thana}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Mauzo/Village Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mauzo" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, mauzo: e.target.value })} value={formParams.mauzo}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Dag/Mark no of the land </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dag" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, dag: e.target.value })} value={formParams.dag}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Khatian of the land</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="khatian" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, khatian: e.target.value })} value={formParams.khatian}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">House Number</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="house_no" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, house_no: e.target.value })} value={formParams.house_no}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Flat Number</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="flat_no" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({ ...formParams, flat_no: e.target.value })} value={formParams.flat_no}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Purpose</label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="type" type="text" onChange={e => updateFormParams({ ...formParams, type: e.target.value })} value={formParams.type}>
                            <option value="1" >Sell</option>
                            <option value="2">Rent</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price / Rent Fee  (ETH)</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({ ...formParams, price: e.target.value })}></input>
                    </div>
                    <div>
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (Press submit afer 10 seconds)</label>
                        <input type={"file"} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={OnChangeFile}></input>
                    </div>
                    <br></br>
                    <div className="text-green text-center">{message}</div>

                    {fileURL != null ?
                        <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                            CREATE APPARTMENT NFT
                        </button>
                        : "Fill up the above form, after verifying all infomations  the submit button will appear."
                    }

                </form>
            </div>
        </div>
    )
}