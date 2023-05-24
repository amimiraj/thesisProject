import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";
import { Link } from "react-router-dom";

export default function Profile() {

    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

            if (accounts[0] != sessionStorage.getItem("account")) {
                window.location.replace("/login")
            }

        }).catch(function (error) { console.error(error); });
    } else {
        window.location.replace("/login")
    }


    // --------------------------------------------------------------------------------------------------------------

    const [userData, updateuserData] = useState([]);
    const [ownerData, updateData] = useState([]);
    const [rentedData, updateRentedData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);

    const address = sessionStorage.getItem('account');



    async function getNFTData(tokenId) {

        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        let balance = await signer.getBalance();
        balance = ethers.utils.formatUnits(balance.toString(), 'ether');
        balance = Number(balance);


        let ownAppartment = await contract.getMyNFTs()
        let rentedAppartment = await contract.getMyRentedNFTs()


        //Fetching all user details
        const userURI = sessionStorage.getItem('userUrl');
        let userData = await axios.get(userURI);
        userData = userData.data;

        let item = {
            image: userData.image,
            name: userData.name,
            nid: userData.nid,
            phone: userData.phone,
            presentAddress: userData.presentAddress,
            permanentAddress: userData.permanentAddress,
            balance: balance,

        }
        updateuserData(item);


        //Fetching all own appartment details
        const allItems = await Promise.all(ownAppartment.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                status: (i.status).toString(),
                image: meta.image,
                name: meta.name,
                thana: meta.thana,
            }
            return item;
        }))
        updateData(allItems);


        //Fetching all rented appartment details
        const rentedItems = await Promise.all(rentedAppartment.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                status: (i.status).toString(),
                image: meta.image,
                name: meta.name,
                thana: meta.thana,
            }
            return item;
        }))
        updateRentedData(rentedItems);


        updateFetched(true);
    }



    const params = useParams();
    const tokenId = params.tokenId;

    if (!dataFetched)
        getNFTData(tokenId);





    return (
        <div className="profileClass" style={{ "minheight": "100vh" }}>

            <Navbar></Navbar>

            <div className="profileClass">

                <div className="text-left text-black shadow-2xl rounded-lg border-1.5 p-5">

                    <div>
                        Name : {userData.name}
                    </div>
                    <div>
                        NID Number  : {userData.nid}
                    </div>
                    <div>
                        Phone Number : {userData.phone}
                    </div>
                    <div>
                        Present Address: {userData.presentAddress}
                    </div>
                    <div>
                        Permanant Address :{userData.permanentAddress}
                    </div>
                    <div>
                        Wallet Address : <span className="text-sm">{address}</span>
                    </div>
                    <div>
                        Current Balance : {userData.balance} ETH
                    </div>
                    <div>
                        History :<Link to="/history"> <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" > Show all Transactions </button></Link>
                    </div>


                </div>
            </div>





            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold"> Own Appartment : {ownerData.length}</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {ownerData.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {ownerData.length == 0 ? "Oops, No NFT data to display." : ""}
                </div>
            </div>


            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold"> Rented Appartment : {rentedData.length}</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {rentedData.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {rentedData.length == 0 ? "Oops, No NFT data to display." : ""}
                </div>
            </div>


        </div>


    )

};