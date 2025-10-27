// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  // Polygon Amoy Testnet (for development)
  rpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  privateKey: process.env.PRIVATE_KEY || '',
  chainId: 80002, // Amoy testnet
  gasLimit: 500000,
  gasPrice: '1000000000', // 1 gwei (Amoy có gas thấp hơn)
  explorerUrl: 'https://amoy.polygonscan.com'
};

// Contract ABI
export const CONTRACT_ABI = [
  "function addProduct(uint256 _id, string memory _name, string memory _productType, uint256 _quantity, string memory _unit, uint256 _harvestDate, string memory _location, string memory _farmerName, string memory _farmerEmail, string[] memory _qualityStandards, string[] memory _certifications, string memory _description, string[] memory _images) public returns (uint256)",
  "function updateProduct(uint256 _id, string memory _name, string memory _productType, uint256 _quantity, string memory _unit, uint256 _harvestDate, string memory _location, string[] memory _qualityStandards, string[] memory _certifications, string memory _description, string[] memory _images) public",
  "function updateProductStatus(uint256 _id, uint8 _status) public",
  "function verifyProduct(uint256 _productId, string memory _blockchainHash) public returns (uint256)",
  "function getProduct(uint256 _id) public view returns (tuple(uint256 id, string name, string productType, uint256 quantity, string unit, uint256 harvestDate, string location, string farmerName, string farmerEmail, string[] qualityStandards, string[] certifications, string description, string[] images, uint8 status, uint256 createdAt, uint256 updatedAt))",
  "function getVerification(uint256 _productId) public view returns (tuple(uint256 productId, string blockchainHash, bool isVerified, uint256 verifiedAt, address verifiedBy))",
  "function isProductVerified(uint256 _productId) public view returns (bool)",
  "function getProductByHash(string memory _hash) public view returns (tuple(uint256 id, string name, string productType, uint256 quantity, string unit, uint256 harvestDate, string location, string farmerName, string farmerEmail, string[] qualityStandards, string[] certifications, string description, string[] images, uint8 status, uint256 createdAt, uint256 updatedAt))",
  "function getProductCount() public view returns (uint256)",
  "function getVerificationCount() public view returns (uint256)"
];

// Status mapping
export const PRODUCT_STATUS = {
  AVAILABLE: 0,
  RESERVED: 1,
  SOLD: 2,
  EXPIRED: 3
} as const;

// Helper functions
export const formatProductForBlockchain = (product: any) => ({
  id: product.id,
  name: product.product_name,
  productType: product.product_type,
  quantity: product.quantity,
  unit: product.unit,
  harvestDate: product.harvest_date,
  location: product.location_address,
  farmerName: product.farmer_name || 'Unknown',
  farmerEmail: product.farmer_email || '',
  qualityStandards: product.quality_standards || [],
  certifications: product.certifications || [],
  description: product.description || '',
  images: product.images || []
});

export const formatProductFromBlockchain = (product: any) => ({
  id: Number(product.id),
  product_name: product.name,
  product_type: product.productType,
  quantity: Number(product.quantity),
  unit: product.unit,
  harvest_date: product.harvestDate,
  location_address: product.location,
  farmer_name: product.farmerName,
  farmer_email: product.farmerEmail,
  quality_standards: product.qualityStandards,
  certifications: product.certifications,
  description: product.description,
  images: product.images,
  status: product.status,
  created_at: product.createdAt,
  updated_at: product.updatedAt
});
