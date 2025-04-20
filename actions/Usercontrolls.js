"use server";

import { getCollection } from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import util from "util";

import { mkdirSync, existsSync } from "fs";



//login
export const login = async function (prevState, formData) {
  const username = formData.get("username")?.trim() || "";
  const password = formData.get("password")?.trim() || "";

  if (!username || !password) {
    return { success: false, errors: { username: "Invalid username or password" } };
  }

  console.log("Login Attempt:", username);

  const collection = await getCollection("users");
  const user = await collection.findOne({ username });

  if (!user) {
    return { success: false, errors: { username: "Invalid username or password" } };
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return { success: false, errors: { username: "Invalid username or password" } };
  }

  const jwttoken = jwt.sign(
    { userid: user._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    process.env.JWTSECRET
  );

  (await cookies()).set("imgenh", jwttoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return { success: true, redirectTo: "/upscale" };
};

//logout
export const logout = async function () {
  const cookieStore = await cookies();
  cookieStore.delete("imgenh");
  return { success: true };
};

//register
export const register = async function (prevState, formData) {
  const username = formData.get("username")?.trim() || "";
  const password = formData.get("password")?.trim() || "";
  const errors = {};

  if (!/^[a-zA-Z0-9]{3,60}$/.test(username)) {
    errors.username = "Username must be 3-60 alphanumeric characters";
  }
  if (password.length < 3 || password.length > 60) {
    errors.password = "Password must be 3-60 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const collection = await getCollection("users");
  const user = await collection.insertOne({ username, password: hashedPassword });

  const jwttoken = jwt.sign(
    { userid: user.insertedId.toString(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    process.env.JWTSECRET
  );

  (await cookies()).set("imgenh", jwttoken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return { success: true, redirectTo: "/upscale" };
};




//upload
const execPromise = util.promisify(exec);


const uploadDir = join(process.cwd(), "public/uploads");
const upscaleDir = join(process.cwd(), "public/upscaled");


async function ensureDirectories() {
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  if (!existsSync(upscaleDir)) mkdirSync(upscaleDir, { recursive: true });
}


export const upload = async function (prevState, formData) {
  try {
    await ensureDirectories();

    console.log("FormData keys:", [...formData.keys()]);
    const file = formData.get("file");
    if (!file) throw new Error("No file uploaded");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

   
    const uploadPath = join(uploadDir, file.name);
    const outputPath = join(upscaleDir, `upscaled_${file.name}`);

   
    await writeFile(uploadPath, buffer);
    console.log("File saved:", uploadPath);

   
    const command = `python upscale.py "${uploadPath}" "${outputPath}"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error("Upscale Error:", stderr);
    }
    console.log("Upscale Output:", stdout);

    return {
      success: true,
      imagePath: `/uploads/${file.name}`,
      upscaledPath: `/upscaled/upscaled_${file.name}`,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message };
  }
};
