import {
    WithId,
    ObjectId,
    InsertOneResult,
    DeleteResult,
    UpdateResult,
} from "mongodb";
import { User } from "../models/user-model.js";
import { connectToDatabase } from "../data/connect.js";

// Defines the collection [users]
const usersCollection = await connectToDatabase<User>("user");

// Find all users
async function getAllUsers(): Promise<WithId<User>[]> {
    const result: WithId<User>[] = await usersCollection.find({}).toArray();
    return result;
}

// Find a specific user
async function getUser(id: string): Promise<WithId<User> | null> {
    const result: WithId<User> | null = await usersCollection.findOne({
        _id: new ObjectId(id),
    });
    return result;
}

// Add new user
async function insertUser(user: User): Promise<ObjectId | null> {
    const result: InsertOneResult<User> = await usersCollection.insertOne(user);
    if (!result.acknowledged) {
        console.log("Could not insert user!");
        return null;
    }
    return result.insertedId;
}

// // Delete user
async function deleteUser(userId: ObjectId): Promise<ObjectId | null> {
    const result: DeleteResult = await usersCollection.deleteOne({
        _id: userId,
    });
    return userId;
}

// Update user
async function updateUser(id: string, updatedUser: User): Promise<any> {
    const result: UpdateResult<User> = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser }
    );

    return result;
}

// Search user
async function searchUser(name: string): Promise<WithId<User>[]> {
    const result: WithId<User>[] = await usersCollection
        .find({ name: { $regex: name, $options: "i" } })
        .toArray();
    return result;
}

export { getAllUsers, getUser, insertUser, deleteUser, updateUser, searchUser };
