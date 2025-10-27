import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, CONTRACT_ABI, formatProductForBlockchain, formatProductFromBlockchain } from '../config/blockchain';

class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    try {
      this.provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
      
      if (BLOCKCHAIN_CONFIG.privateKey) {
        this.wallet = new ethers.Wallet(BLOCKCHAIN_CONFIG.privateKey, this.provider);
        this.contract = new ethers.Contract(
          BLOCKCHAIN_CONFIG.contractAddress,
          CONTRACT_ABI,
          this.wallet
        );
      } else {
        console.warn('⚠️  Private key not provided. Blockchain service will run in read-only mode.');
      }
    } catch (error) {
      console.warn('⚠️  Failed to initialize blockchain service:', error);
      this.provider = null as any;
      this.wallet = null as any;
      this.contract = null as any;
    }
  }

  // Check if blockchain is available
  async isAvailable(): Promise<boolean> {
    try {
      if (!this.provider) {
        return false;
      }
      await this.provider.getBlockNumber();
      return true;
    } catch (error) {
      console.error('Blockchain not available:', error);
      return false;
    }
  }

  // Add product to blockchain
  async addProduct(productData: {
    id: number;
    name: string;
    productType: string;
    quantity: number;
    unit: string;
    harvestDate: string;
    location: string;
    farmerName: string;
    farmerEmail: string;
    qualityStandards: string[];
    certifications: string[];
    description: string;
    images: string[];
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.wallet || !this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }

      const tx = await this.contract.addProduct(
        productData.id,
        productData.name,
        productData.productType,
        productData.quantity,
        productData.unit,
        Math.floor(new Date(productData.harvestDate).getTime() / 1000),
        productData.location,
        productData.farmerName,
        productData.farmerEmail,
        productData.qualityStandards,
        productData.certifications,
        productData.description,
        productData.images,
        {
          gasLimit: BLOCKCHAIN_CONFIG.gasLimit,
          gasPrice: BLOCKCHAIN_CONFIG.gasPrice
        }
      );

      const receipt = await tx.wait();
      console.log('✅ Product added to blockchain:', receipt.transactionHash);

      return { 
        success: true, 
        txHash: receipt.transactionHash 
      };
    } catch (error: any) {
      console.error('❌ Error adding product to blockchain:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Update product on blockchain
  async updateProduct(productId: number, productData: {
    name: string;
    productType: string;
    quantity: number;
    unit: string;
    harvestDate: string;
    location: string;
    qualityStandards: string[];
    certifications: string[];
    description: string;
    images: string[];
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.wallet || !this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }

      const tx = await this.contract.updateProduct(
        productId,
        productData.name,
        productData.productType,
        productData.quantity,
        productData.unit,
        Math.floor(new Date(productData.harvestDate).getTime() / 1000),
        productData.location,
        productData.qualityStandards,
        productData.certifications,
        productData.description,
        productData.images,
        {
          gasLimit: BLOCKCHAIN_CONFIG.gasLimit,
          gasPrice: BLOCKCHAIN_CONFIG.gasPrice
        }
      );

      const receipt = await tx.wait();
      console.log('✅ Product updated on blockchain:', receipt.transactionHash);

      return { 
        success: true, 
        txHash: receipt.transactionHash 
      };
    } catch (error: any) {
      console.error('❌ Error updating product on blockchain:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Verify product on blockchain
  async verifyProduct(productId: number, blockchainHash: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.wallet || !this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }

      const tx = await this.contract.verifyProduct(
        productId,
        blockchainHash,
        {
          gasLimit: BLOCKCHAIN_CONFIG.gasLimit,
          gasPrice: BLOCKCHAIN_CONFIG.gasPrice
        }
      );

      const receipt = await tx.wait();
      console.log('✅ Product verified on blockchain:', receipt.transactionHash);

      return { 
        success: true, 
        txHash: receipt.transactionHash 
      };
    } catch (error: any) {
      console.error('❌ Error verifying product on blockchain:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get product from blockchain
  async getProduct(productId: number): Promise<{ success: boolean; product?: any; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }
      const product = await this.contract.getProduct(productId);
      
      return { 
        success: true, 
        product: {
          id: product.id.toString(),
          name: product.name,
          productType: product.productType,
          quantity: product.quantity.toString(),
          unit: product.unit,
          harvestDate: new Date(Number(product.harvestDate) * 1000).toISOString(),
          location: product.location,
          farmerName: product.farmerName,
          farmerEmail: product.farmerEmail,
          qualityStandards: product.qualityStandards,
          certifications: product.certifications,
          description: product.description,
          images: product.images,
          status: product.status,
          createdAt: new Date(Number(product.createdAt) * 1000).toISOString(),
          updatedAt: new Date(Number(product.updatedAt) * 1000).toISOString()
        }
      };
    } catch (error: any) {
      console.error('❌ Error getting product from blockchain:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get verification from blockchain
  async getVerification(productId: number): Promise<{ success: boolean; verification?: any; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }
      const verification = await this.contract.getVerification(productId);
      
      return { 
        success: true, 
        verification: {
          productId: verification.productId.toString(),
          blockchainHash: verification.blockchainHash,
          isVerified: verification.isVerified,
          verifiedAt: new Date(Number(verification.verifiedAt) * 1000).toISOString(),
          verifiedBy: verification.verifiedBy
        }
      };
    } catch (error: any) {
      console.error('❌ Error getting verification from blockchain:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Check if product is verified on blockchain
  async isProductVerified(productId: number): Promise<{ success: boolean; isVerified?: boolean; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }
      const isVerified = await this.contract.isProductVerified(productId);
      
      return { 
        success: true, 
        isVerified 
      };
    } catch (error: any) {
      console.error('❌ Error checking product verification:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get product by blockchain hash
  async getProductByHash(hash: string): Promise<{ success: boolean; product?: any; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }
      const product = await this.contract.getProductByHash(hash);
      
      return { 
        success: true, 
        product: {
          id: product.id.toString(),
          name: product.name,
          productType: product.productType,
          quantity: product.quantity.toString(),
          unit: product.unit,
          harvestDate: new Date(Number(product.harvestDate) * 1000).toISOString(),
          location: product.location,
          farmerName: product.farmerName,
          farmerEmail: product.farmerEmail,
          qualityStandards: product.qualityStandards,
          certifications: product.certifications,
          description: product.description,
          images: product.images,
          status: product.status,
          createdAt: new Date(Number(product.createdAt) * 1000).toISOString(),
          updatedAt: new Date(Number(product.updatedAt) * 1000).toISOString()
        }
      };
    } catch (error: any) {
      console.error('❌ Error getting product by hash:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get blockchain stats
  async getStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      if (!this.contract) {
        return { success: false, error: 'Blockchain not initialized' };
      }
      const productCount = await this.contract.getProductCount();
      const verificationCount = await this.contract.getVerificationCount();
      
      return { 
        success: true, 
        stats: {
          productCount: productCount.toString(),
          verificationCount: verificationCount.toString(),
          network: 'Polygon Mumbai',
          contractAddress: BLOCKCHAIN_CONFIG.contractAddress
        }
      };
    } catch (error: any) {
      console.error('❌ Error getting blockchain stats:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default new BlockchainService();
