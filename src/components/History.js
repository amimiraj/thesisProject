
import { useState } from "react";
import { Link } from "react-router-dom";

import { useLocation, useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import NFTTile from "./NFTTile";

export default function History() {

    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {

            if (accounts[0] != sessionStorage.getItem("account")) {
                window.location.replace("/")
            }

        }).catch(function (error) { console.error(error); });
    } else {
        window.location.replace("/")
    }


    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [tempBalance, updateTempBalance] = useState();
    const address = sessionStorage.getItem('account');



    async function historyData() {

        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        let balance = await signer.getBalance();

        // balance = ethers.utils.formatUnits(balance.toString(), 'ether');
        balance = Number(balance);
        updateTempBalance(balance);


        let history = await contract.returnTransactionHistory();

        updateData(history);
        updateFetched(true);

    }


    if (!dataFetched)
        historyData();




    return (
        <div className="profileClass" style={{ "minheight": "100vh" }}>
            <Navbar></Navbar>

            <div style={{ height: "150px"}}></div>


            <div className="profileClass">

                <div className="relative overflow-x-auto shadow-md sm:square-lg">

                    <table className="w-full text-sm text-left text-gray-900 dark:text-gray-50">


                        <thead className="text-xs uppercase bg-purple-400 dark:text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Token Nuber
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Transaction Reason
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Cost (Wei)

                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Time and Date
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {data.map((value, i) => {

                                return (
                                <tr className="border-b bg-purple-300 dark:border-gray-400 text-gray-700" key={i}>
                                    <th scope="row" className="px-6 py-4 dark:text-black" >
                                        {(value.tokenId).toString()}
                                    </th>
                                    <td className="px-6 py-4">
                                        {value.purpose}

                                    </td>
                                    <td className="px-6 py-4">
                                        {(data.length - 1) == i ? (value.cost - tempBalance).toString() : value.cost.toString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(new Date(value.time * 1000)).toLocaleString()}

                                    </td>
                                </tr>
                                )

                            })}

                        </tbody>
                    </table>
                </div>

            </div>
            <div style={{ "height": "150px" }}></div>

        </div>
    )

};
