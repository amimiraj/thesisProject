import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";




export default function NFTPage(props) {


    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

            if (accounts[0] != sessionStorage.getItem("account")) {
                window.location.replace("/login")
            }

        }).catch(function (error) { console.error(error); });
    } else {
        window.location.replace("/login")
    }



    const [data, updateData] = useState({});
    const [renterData, updateRenterData] = useState({});

    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currentAddress, updatecurrentAddress] = useState("");


    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);




    async function getNFTData(tokenId) {

        const cAddress = await signer.getAddress();
        updatecurrentAddress(cAddress);



        //Fetching tokenURL
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);


        const user = await contract.users(listedToken.owner);
        const renterinfo = await contract.users(listedToken.renter);



        let metaUser = await axios.get(user.userURL);


        if (renterinfo.exits) {
            let metaRenter = await axios.get(renterinfo.userURL);
            metaRenter = metaRenter.data;
            let item = {
                renterName:metaRenter.name,
                renterPhone:metaRenter.phone,
            }
            updateRenterData(item);
        }



        metaUser = metaUser.data;




        var utcSeconds = listedToken.date_time;
        var dateTime = new Date(utcSeconds * 1000);
        // var create_rent_date = date_time.toISOString().split('T')[0];
        const string_dateTime = dateTime.toLocaleString();

        let meta = await axios.get(tokenURI);
        meta = meta.data;

        // alert(meta)


        let price = ethers.utils.formatUnits(listedToken.price, 'ether');


        let item = {
            tokenId: tokenId,
            previousOwner: listedToken.previousOwner,
            owner: listedToken.owner,
            ownerName: metaUser.name,
            ownerPhone: metaUser.phone,
            country: meta.country,
            division: meta.division,
            district: meta.district,
            thana: meta.thana,
            mauzo: meta.mauzo,
            dag: meta.dag,
            khatian: meta.khatian,
            house_no: meta.house_no,
            flat_no: meta.flat_no,
            status: (listedToken.status).toString(),
            renter: listedToken.renter,
            price: price,
            image: meta.image,
            currentlyListed: listedToken.currentlyListed,
            dateinfo: string_dateTime,

        }

        updateData(item);
        updateDataFetched(true);
    }


    async function buyNFT(tokenId) {
        try {
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')

            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")

            let balance = await signer.getBalance();

            //run the executeSale 
            let transaction = await contract.executeSale(balance, tokenId, { value: salePrice });
            await transaction.wait();
            alert('You successfully bought the Appartment NFT!');

            updateMessage("");
            window.location.reload();
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }


    async function sell(tokenId) {

        try {
            let balance = await signer.getBalance();

            let transaction = await contract.resellToken(balance, tokenId);
            await transaction.wait();

            alert('The appartment is  successfully uploded to the Marketplace.');
            updateMessage("");
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }


    async function takeRent(tokenId) {
        try {

            const rentPrice = ethers.utils.parseUnits(data.price, 'ether')
            updateMessage("Renting the Appartment... Please Wait (Upto 5 mins)")

            let balance = await signer.getBalance();
            let transaction = await contract.rentApparatment(balance, tokenId, { value: rentPrice });
            await transaction.wait();

            alert('You successfully Rented the Appartment for next 5 minutes!');
            updateMessage("");
            window.location.reload();
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }



    async function leaveAppartment(tokenId) {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const rentPrice = ethers.utils.parseUnits(data.price, 'ether')

            let balance = await signer.getBalance();
            // balance = ethers.utils.formatUnits(balance.toString(), 'ether');
            // balance=Number(balance);

            let transaction = await contract.returnApparatment(balance, tokenId);
            await transaction.wait();

            alert('The appartment has been leaved.');
            updateMessage("");
            window.location.reload();
        }
        catch (e) {
            alert("Sorry. You can not leave befor the paid date.")
        }
    }



    const params = useParams();
    const tokenId = params.tokenId;

    if (!dataFetched)
        getNFTData(tokenId);

    // alert(currentAddress+"      "+data.owner+"  "+data.status)

    return (
        <div style={{ "minheight": "100vh" }}>


            <Navbar></Navbar>
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />

                <div className="text-xl ml-20 space-y-1.5 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div className="text-bold">
                        Token Id : {data.tokenId} , ({data.status == "1" ? " Available for sell " : data.status == "2" ? " Alailable for rent " : data.status == "3" ? " Sold Out " : " Rented"})
                    </div>
                    <div>
                        Address : <span className="text-sm"> {data.flat_no}, {data.house_no}, {data.mauzo}, {data.thana}, {data.district}, {data.division}, {data.country}.</span>
                    </div>
                    <div>
                        Khatian number: {data.khatian}
                    </div>
                    <div>
                        Dag/Mark number: {data.dag}
                    </div>
                    <div>
                        Previous Owner: <span className="text-sm">{data.previousOwner}</span>
                    </div>
                    {/* <div>
                        Present Owner: <span className="text-sm">{data.owner} </span>
                    </div> */}
                    <div>
                        Present Owner : {data.ownerName}
                    </div>
                    <div>
                     Contact: {data.ownerPhone}
                    </div>

                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>
                    </div>

                    <div style={{ "height": "15px" }}></div>


                    <div>
                        {
                            ((currentAddress == data.owner) && ((data.status == "1") || (data.status == "2"))) ?
                                <div className="text-emerald-700">You are the owner of this appartment </div>
                                : data.status == "1" ? <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                                    : data.status == "2" ? <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => takeRent(tokenId)}>Take Rent for 5 minutes</button>
                                        :(currentAddress == data.owner && data.status == "3" && data.currentlyListed==true) ? <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => sell(tokenId)}>Sell this NFT</button>
                                            : (currentAddress == data.renter && data.status == "4") ? <div><button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => takeRent(tokenId)}>Pay for next Month</button> || <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => leaveAppartment(tokenId)}>Leave the Appartment</button> </div>
                                                :(data.status=="3" || data.currentlyListed==false)? <div className="text-purple-700">This is the previous token. </div>
                        //  :"Renter :  "+renterData.renterName}
                         :"Renter :  "+renterData.renterName+",    Phone: "+renterData.renterPhone }


                        <div className="text-green text-center mt-3">{message}</div> <br />


                        {data.status == "4" ? <div className="text-blue-800 text-center mt-3"> Rent paid for this date: {data.dateinfo}</div>
                            : data.status == "3" ? <div className="text-blue-800 text-center mt-3"> Purchase date: {data.dateinfo}</div>
                                : <div className="text-blue-800 text-center mt-3">Uploaded Date: {data.dateinfo}</div>
                        }

                    </div>


                </div>
            </div>
        </div>
    )
}