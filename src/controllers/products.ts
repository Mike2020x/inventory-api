import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQuantity,
      stockQuantity,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    } = req.body;
    //barCode
    //sku
    //productCode
    //slug
    const existingProductBySlug = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (existingProductBySlug) {
      return res.status(409).json({
        error: `Product ${name} already exists`,
        data: null,
      });
    }

    const existingProductBySKU = await db.product.findUnique({
      where: {
        sku,
      },
    });
    if (existingProductBySKU) {
      return res.status(409).json({
        error: `Product SKU ${sku} already exists`,
        data: null,
      });
    }
    const existingProductByProductCode = await db.product.findUnique({
      where: {
        productCode,
      },
    });
    if (existingProductByProductCode) {
      return res.status(409).json({
        error: `Product Code ${productCode} already exists`,
        data: null,
      });
    }

    if (barCode) {
      const existingProductByBarCode = await db.product.findUnique({
        where: {
          barCode,
        },
      });
      if (existingProductByBarCode) {
        return res.status(409).json({
          error: `Product Bar Code ${barCode} already exists`,
          data: null,
        });
      }
    }
    const newProduct = await db.product.create({
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQuantity,
        stockQuantity,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
      },
    });
    return res.status(201).json({
      data: newProduct,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error,
    });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      data: products,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "something went wrong",
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingProduct = await db.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        error: "product does not exist",
      });
    }
    return res.status(200).json({
      data: existingProduct,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "something went wrong",
    });
  }
}

export async function updateProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQuantity,
      stockQuantity,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    } = req.body;
    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!existingProduct) {
      return res.status(404).json({
        error: "product not found",
        data: null,
      });
    }
    if (slug !== existingProduct.slug) {
      const existingProductBySlug = await db.product.findUnique({
        where: {
          slug,
        },
      });
      if (existingProductBySlug) {
        return res.status(409).json({
          error: `Product ${name} already exists`,
          data: null,
        });
      }
    }

    if (sku !== existingProduct.sku) {
      const existingProductBySKU = await db.product.findUnique({
        where: {
          sku,
        },
      });
      if (existingProductBySKU) {
        return res.status(409).json({
          error: `Product SKU ${sku} already exists`,
          data: null,
        });
      }
    }

    if (productCode !== existingProduct.productCode) {
      const existingProductByProductCode = await db.product.findUnique({
        where: {
          productCode,
        },
      });
      if (existingProductByProductCode) {
        return res.status(409).json({
          error: `Product Code ${productCode} already exists`,
          data: null,
        });
      }
    }

    if (barCode && barCode !== existingProduct.barCode) {
      const existingProductByBarCode = await db.product.findUnique({
        where: {
          barCode,
        },
      });
      if (existingProductByBarCode) {
        return res.status(409).json({
          error: `Product Bar Code ${barCode} already exists`,
          data: null,
        });
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQuantity,
        stockQuantity,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
      },
    });
    return res.status(200).json({
      data: updatedProduct,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}

export async function deleteProductById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      return res.status(404).json({
        data: null,
        error: "product not found",
      });
    }
    await db.product.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}
