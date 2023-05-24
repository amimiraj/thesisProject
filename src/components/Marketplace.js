import MarketNavbar from "./MarketNavbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { useLocation } from 'react-router';
import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";



export default function Marketplace() {


    // if (typeof window.ethereum !== 'undefined') {
    //     window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

    //         if (accounts[0] != sessionStorage.getItem("account")) {
    //             window.location.replace("/")
    //         }

    //     }).catch(function (error) { console.error(error); });
    // } else {
    //     window.location.replace("/")
    // }


    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [searchValue, setSearchValue] = useState();


    async function getAllNFTs() {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        //All NFT Token
        let transaction = await contract.getAllNFTs();


        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            const listedToken = await contract.getListedTokenForId(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                image: meta.image,
                status: (listedToken.status).toString(),
                thana: meta.thana,
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }


    async function searchNFTs() {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        //All NFT Token
        let transaction = await contract.search(searchValue);


        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            const listedToken = await contract.getListedTokenForId(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                image: meta.image,
                status: (listedToken.status).toString(),
                thana: meta.thana,
            }
            return item;
        }))
        updateData(items);
    }


    
    if (searchValue>0){
        searchNFTs();
    }else if (!dataFetched){ 
        getAllNFTs();
    }


    return (
        <div>
            <MarketNavbar setSearchValue={setSearchValue}></MarketNavbar>
            {data.length == 0 ? <div style={{ height: "320px" }}></div> : ""}
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    {data.length == 0 ? "NO AVAILABLE APPARTMENTS " :"ALL AVAILABLE APPARTMENTS"}
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => { return <NFTTile data={value} key={index}></NFTTile>; })}
                </div>
            </div>
        </div>
    );

}