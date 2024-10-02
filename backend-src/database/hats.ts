import {
    WithId,
    ObjectId,
    InsertOneResult,
    DeleteResult,
    UpdateResult,
} from "mongodb";
import { Hat } from "../models/hat-model.js";
import { connectToDatabase } from "../data/connect.js";

// Defines the collection [hats]
const productsCollection = await connectToDatabase<Hat>("hats");

// Get all products
async function getAllProducts(): Promise<WithId<Hat>[]> {
    const result: WithId<Hat>[] = await productsCollection.find({}).toArray();
    return result;
}

// Get specific product
async function getProduct(id: string): Promise<WithId<Hat> | null> {
    const result: WithId<Hat> | null = await productsCollection.findOne({
        _id: new ObjectId(id),
    });
    return result;
}

// Add product
async function insertProduct(hat: Hat): Promise<ObjectId | null> {
    const result: InsertOneResult<Hat> = await productsCollection.insertOne(
        hat
    );
    if (!result.acknowledged) {
        console.log("Could not insert hat!");
        return null;
    }
    return result.insertedId;
}

// Delete product
async function deleteProduct(hatId: ObjectId): Promise<ObjectId | null> {
    const result: DeleteResult = await productsCollection.deleteOne({
        _id: hatId,
    });
    return hatId;
}

//  Update product
async function updateProduct(id: string, updatedHat: Hat): Promise<any> {
    const result: UpdateResult<Hat> = await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedHat }
    );
    return result;
}
// Search product
async function searchProduct(name: string): Promise<WithId<Hat>[]> {
    const result: WithId<Hat>[] = await productsCollection
        .find({ name: { $regex: name, $options: "i" } })
        .toArray();
    return result;
}

export {
    getAllProducts,
    getProduct,
    insertProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
};
