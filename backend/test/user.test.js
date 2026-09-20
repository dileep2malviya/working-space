import mongoose from "mongoose";
import request from "supertest";
import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { connectRedis } from "../src/config/redisConnection.js";

beforeAll(async () => {
    await connectDB();
    await connectRedis()
}, 20000);

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /api/v1/user/create", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/v1/user/create")
            .send({
                firstName: "Dileep",
                lastName: "lohar",
                username: "dileep2lohar",
                email: "dileep22malviya@gmail.com",
                password: "Dileep@1223",
            });

        expect(res.body.message).toBe("User registered successfully");
        expect(res.body.success).toBe(true);
        expect(res.body.statusCode).toBe(201);
    },
        20000
    );
});


describe("POST /api/user/v1/login", () => {
    it("Should login user", async () => {
        const res = await request(app)
            .post("/api/v1/user/login")
            .send({
                email: "dileep22malviya@gmail.com",
                password: 'Dileep@1223'
            })
        console.log("res :: ", res)

        expect(res.body.message).toBe("User Logged In Successfully");
        expect(res.body.success).toBe(true);
        expect(res.body.statusCode).toBe(200);
    },
        20000
    )
})



