//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable contractAddress;
    //The fee charged by the marketplace to be allowed to list an NFT

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address previousOwner;
        address payable owner;
        uint256 price;
        bool currentlyListed;
        uint256 status; // 1-sell, 2-rent, 3-sold, 4-rented
        address renter;
        uint256 date_time;
    }

    struct userInfo {
        bytes32 password;
        string userURL;
        bool exits;
    }

    struct transactionInfo {
        uint256 tokenId;
        string purpose;
        uint256 cost;
        uint256 time;
    }

    // //the event emitted when a token is successfully listed and rented
    event apparatmentRented(uint256 tokenId, address renter, uint256 rentTime);
    event apparatmentReturned(uint256 tokenId, address renter);
    event userAdded(address userid, string userinfo);

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address previousOwner,
        address owner,
        uint256 price,
        bool currentlyListed,
        uint256 status,
        address renter,
        uint256 date_time
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(address => transactionInfo[]) public transactionInformations;
    mapping(uint256 => ListedToken) public idToListedToken;
    mapping(address => userInfo) public users;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        contractAddress = payable(msg.sender);
    }

    // User registration
    function addUser(
        uint256 balance,
        address userid,
        string memory password,
        string memory userURL
    ) public {
        require(!users[userid].exits, "This user already exists");
        users[userid].password = keccak256(bytes(password));
        users[userid].userURL = userURL;
        users[userid].exits = true;

        transactionHistory(balance, "Registration", 0);

        emit userAdded(userid, userURL);
    }

    function loginInfo(
        address _userid,
        string memory _password
    ) public view returns (string memory) {
        require(users[_userid].exits, "This user id not exists");
        require(
            users[_userid].password == keccak256(bytes(_password)),
            "Incorrect Password !"
        );

        return users[_userid].userURL;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(
        uint256 balance,
        string memory tokenURI,
        uint256 status,
        uint256 price
    ) public payable returns (uint256) {
        _tokenIds.increment(); // strat from 1

        _safeMint(msg.sender, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);

        createListedToken(_tokenIds.current(), price, status);

        transactionHistory(balance, "Create Token", _tokenIds.current());

        return _tokenIds.current();
    }

    function createListedToken(
        uint256 tokenId,
        uint256 price,
        uint256 status
    ) private {
        require(price > 0, "Make sure the price isn't negative");
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            (address(this)),
            payable(msg.sender),
            price,
            true,
            status,
            address(0),
            block.timestamp
        );

        _transfer(msg.sender, address(this), tokenId);

        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true,
            status,
            address(0),
            block.timestamp
        );
    }

    // All the NFTs currently listed to be sold on the marketplace--------
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 itemCount = 0;
        uint256 nftCount = _tokenIds.current();

        for (uint256 i = 0; i < nftCount; i++) {
            if (
                idToListedToken[i + 1].status == 1 ||
                idToListedToken[i + 1].status == 2
            ) {
                itemCount += 1;
            }
        }
        ListedToken[] memory tokens = new ListedToken[](itemCount);

        uint256 currentIndex = 0;
        uint256 currentId;

        for (uint256 i = 0; i < nftCount; i++) {
            currentId = i + 1;

            if (
                idToListedToken[currentId].status == 1 ||
                idToListedToken[currentId].status == 2
            ) {
                ListedToken storage currentItem = idToListedToken[currentId];
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return tokens;
    }

    // Owner All the NFTs --------------------------------------
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToListedToken[i].owner == msg.sender) {
                count += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        count = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToListedToken[i].owner == msg.sender) {
                items[count] = idToListedToken[i];
                count++;
            }
        }

        return items;
    }

    // Selling the appartmnet
    function executeSale(uint256 balance, uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;
        address owner = idToListedToken[tokenId].owner;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].status = 3;
        idToListedToken[tokenId].date_time = block.timestamp;
        idToListedToken[tokenId].previousOwner = idToListedToken[tokenId].owner;
        idToListedToken[tokenId].owner = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        // payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(owner).transfer(msg.value);

        transactionHistory(balance, "Purchased", tokenId);
    }

    //Reselling  token is created, it is listed here
    function resellToken(uint256 balance, uint256 tokenId) public payable {
        string memory tokenURI = tokenURI(tokenId);
        uint256 price = idToListedToken[tokenId].price * 2;
        idToListedToken[tokenId].currentlyListed = false;
        createToken(balance, tokenURI, 1, price);
    } //---------------------------------------------------------------------------------------------------------------

    //Renting the appartment----------------------------------------------------------------------
    function rentApparatment(uint256 balance, uint256 tokenId) public payable {
        ListedToken storage listedToken = idToListedToken[tokenId];

        require(msg.value == listedToken.price, "Incorrect payment amount");

        if (listedToken.status == 2) {
            listedToken.status = 4;
            listedToken.renter = msg.sender;
            listedToken.date_time = block.timestamp + 300;
        } else {
            listedToken.date_time = listedToken.date_time + 300;
        }

        payable(listedToken.owner).transfer(msg.value);
        transactionHistory(balance, "Rent Apaartment", tokenId);

        emit apparatmentRented(tokenId, msg.sender, block.timestamp);
    }

    // Leaving the appartment --------------------------------------------------------------------------------------
    function returnApparatment(
        uint256 balance,
        uint256 tokenId
    ) public payable {
        ListedToken storage listedToken = idToListedToken[tokenId];

        require(
            listedToken.renter == msg.sender,
            "Only the renter can return the item"
        );
                require(
            listedToken.date_time <= block.timestamp,
            "You can not lean until the deadline pass"
        );

        listedToken.status = 2;
        listedToken.renter = address(0);
        listedToken.date_time = block.timestamp;

        transactionHistory(balance, "Return Apaartment", tokenId);

        emit apparatmentReturned(tokenId, msg.sender);
    }

    //All NFTs that the current user is rented----
    function getMyRentedNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 count = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToListedToken[i].renter == msg.sender) {
                count += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        count = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToListedToken[i].renter == msg.sender) {
                items[count] = idToListedToken[i];
                count++;
            }
        }

        return items;
    }

    function transactionHistory(
        uint256 balance,
        string memory purpose,
        uint256 token
    ) public payable {
        if (transactionInformations[msg.sender].length > 0) {
            uint256 cost = transactionInformations[msg.sender][
                transactionInformations[msg.sender].length - 1
            ].cost - balance;
            transactionInformations[msg.sender][
                transactionInformations[msg.sender].length - 1
            ].cost = cost;
        }
        transactionInfo memory temp = transactionInfo(
            token,
            purpose,
            balance,
            block.timestamp
        );
        transactionInformations[msg.sender].push(temp);
    }

    function returnTransactionHistory()
        public
        view
        returns (transactionInfo[] memory)
    {
        return transactionInformations[msg.sender];
    }

    function search(
        uint256 tokenId
    ) public view returns (ListedToken[] memory) {
        bytes32 tokenUriHash = keccak256(bytes(tokenURI(tokenId)));
        uint256 count = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            bytes32 temp = keccak256(bytes(tokenURI(i)));

            if (tokenUriHash == temp) {
                count++;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        count = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            bytes32 temp = keccak256(bytes(tokenURI(i)));

            if (tokenUriHash == temp) {
                items[count] = idToListedToken[i];
                count++;
            }
        }

        return items;
    }

    //---------------------End of the smart Contract
}
