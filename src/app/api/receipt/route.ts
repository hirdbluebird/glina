//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { Client, product } from "mindee";
import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.m9byflm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
const mindeeClient = new Client({ apiKey: process.env.MINDEE_API_KEY });

export async function POST(req: NextRequest, res: NextResponse) {
  // if (process.env.NODE_ENV === "development") {
  //   return NextResponse.json({ text: "everything is good" });
  // }
  const file = (await req.formData()).get("photo");
  const a = await file.arrayBuffer();
  const b = Buffer.from(a).toString("base64");
  const inputSource = mindeeClient.docFromBase64(b, file.name);
  const apiResponse = await mindeeClient.parse(product.ReceiptV5, inputSource);
  const receiptText = apiResponse.document.inference.prediction;

  await client.connect();

  client
    .db("ha4apure")
    .collection("receipt")
    .insertOne({
      ...receiptText,
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      throw new Error(e);
    });

  return NextResponse.json({ receiptText });
}
