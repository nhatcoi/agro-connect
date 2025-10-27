// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductTraceability {
    struct Product {
        uint256 id;
        string name;
        string productType;
        uint256 quantity;
        string unit;
        uint256 harvestDate;
        string location;
        string farmerName;
        string farmerEmail;
        string[] qualityStandards;
        string[] certifications;
        string description;
        string[] images;
        uint8 status; // 0: available, 1: reserved, 2: sold, 3: expired
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Verification {
        uint256 productId;
        string blockchainHash;
        bool isVerified;
        uint256 verifiedAt;
        address verifiedBy;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Verification) public verifications;
    mapping(string => uint256) public productHashes; // hash => productId
    
    address public owner;
    uint256 public productCount;
    uint256 public verificationCount;

    event ProductAdded(uint256 indexed productId, string name, string farmerName);
    event ProductUpdated(uint256 indexed productId, string name);
    event ProductVerified(uint256 indexed productId, string blockchainHash, address verifiedBy);
    event ProductStatusChanged(uint256 indexed productId, uint8 oldStatus, uint8 newStatus);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProduct(
        uint256 _id,
        string memory _name,
        string memory _productType,
        uint256 _quantity,
        string memory _unit,
        uint256 _harvestDate,
        string memory _location,
        string memory _farmerName,
        string memory _farmerEmail,
        string[] memory _qualityStandards,
        string[] memory _certifications,
        string memory _description,
        string[] memory _images
    ) public onlyOwner returns (uint256) {
        require(products[_id].id == 0, "Product already exists");
        
        products[_id] = Product({
            id: _id,
            name: _name,
            productType: _productType,
            quantity: _quantity,
            unit: _unit,
            harvestDate: _harvestDate,
            location: _location,
            farmerName: _farmerName,
            farmerEmail: _farmerEmail,
            qualityStandards: _qualityStandards,
            certifications: _certifications,
            description: _description,
            images: _images,
            status: 0, // available
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        productCount++;
        
        emit ProductAdded(_id, _name, _farmerName);
        return _id;
    }

    function updateProduct(
        uint256 _id,
        string memory _name,
        string memory _productType,
        uint256 _quantity,
        string memory _unit,
        uint256 _harvestDate,
        string memory _location,
        string[] memory _qualityStandards,
        string[] memory _certifications,
        string memory _description,
        string[] memory _images
    ) public onlyOwner {
        require(products[_id].id != 0, "Product does not exist");
        
        Product storage product = products[_id];
        product.name = _name;
        product.productType = _productType;
        product.quantity = _quantity;
        product.unit = _unit;
        product.harvestDate = _harvestDate;
        product.location = _location;
        product.qualityStandards = _qualityStandards;
        product.certifications = _certifications;
        product.description = _description;
        product.images = _images;
        product.updatedAt = block.timestamp;

        emit ProductUpdated(_id, _name);
    }

    function updateProductStatus(uint256 _id, uint8 _status) public onlyOwner {
        require(products[_id].id != 0, "Product does not exist");
        require(_status <= 3, "Invalid status");
        
        uint8 oldStatus = products[_id].status;
        products[_id].status = _status;
        products[_id].updatedAt = block.timestamp;

        emit ProductStatusChanged(_id, oldStatus, _status);
    }

    function verifyProduct(
        uint256 _productId,
        string memory _blockchainHash
    ) public onlyOwner returns (uint256) {
        require(products[_productId].id != 0, "Product does not exist");
        require(verifications[_productId].productId == 0, "Product already verified");
        
        verifications[_productId] = Verification({
            productId: _productId,
            blockchainHash: _blockchainHash,
            isVerified: true,
            verifiedAt: block.timestamp,
            verifiedBy: msg.sender
        });

        productHashes[_blockchainHash] = _productId;
        verificationCount++;

        emit ProductVerified(_productId, _blockchainHash, msg.sender);
        return verificationCount;
    }

    function getProduct(uint256 _id) public view returns (Product memory) {
        require(products[_id].id != 0, "Product does not exist");
        return products[_id];
    }

    function getVerification(uint256 _productId) public view returns (Verification memory) {
        require(verifications[_productId].productId != 0, "Product not verified");
        return verifications[_productId];
    }

    function isProductVerified(uint256 _productId) public view returns (bool) {
        return verifications[_productId].isVerified;
    }

    function getProductByHash(string memory _hash) public view returns (Product memory) {
        uint256 productId = productHashes[_hash];
        require(productId != 0, "Product not found for this hash");
        return products[productId];
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }

    function getVerificationCount() public view returns (uint256) {
        return verificationCount;
    }
}
