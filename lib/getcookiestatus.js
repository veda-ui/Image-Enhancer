"use server"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
export  default async function cookiestatus() {
    const cookiee =  await cookies()
    const condition = cookiee.get("imgenh")?.value;
    if (!condition) return null;

    try {
        const decoded = jwt.verify(condition, process.env.JWTSECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}
