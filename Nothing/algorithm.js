
// Algorithm-1:USC // ->  User Smart-Contract
1 Input: req -> the request from the user
2 Output: resp -> the SmartContract generated response


4 contract  AppartmentMarketPlace

    15  function registrationFunc(data)
    16      if data == registered then
    17          return False;
    18      else
    19          userID := data.Address;
    20          h := data.h;
    21          dataStore(userID, h); 
    22          return "Registration successfull";

    23 function loginFunc(data)

    26     if data == matched then
    27     return TRUE;
    28     else
    29     return FALSE;

19   function creatTokenFunc(data)
20      tokenId := uniqTokenNumber;
21      available := TRUE
22      h := data.h; -> hash from IPFS
23      putState(tokenId, h); ->store into blockchain
24      return TRUE;

25 function buyTokenFunc(data)
26    if data.tokenID == available then
27      if data.price == price then
28          available := FALSE
29          date := Updataetime();
30          putState(data.amount, ownerAddress); -> Transfer Ether to the seller
31          putState(ownerAddress, data.Address) -> Transfer the ownership
32          return TRUE;

33 function sellTokenFunc(data)
34  if data.address == ownerAddress then
35      if data.available == False then
36          creatTokenFunc(data);->calling the above function

37 function rentTokenFunc(data)
38  if data.tokenID == rentable then
39      if data.price == price then
40          rentable := FALSE;
41          Rentdate := Updataetime()+30 days; -> renting for 1 month
42          putState(data.amount, ownerAddress); -> Transfer Ether to the owner

43 function leaveTokenFunc(data)
44  if data.renterAddress == renterAddress then
45      if data.Rentdate > Rentdate then
46          rentable := TRUE 
47      else 
48          "You can not return token at this moemnt"    
49      end


















