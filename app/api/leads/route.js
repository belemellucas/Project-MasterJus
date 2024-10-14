import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
   
      const { nome, email } = body;
      const new_lead = await prisma.lead.create({
        data: {
          email,
          nome,
        },
      });
      return NextResponse.json(
        { message: "Email cadastrado" },
        { status: 201 }
      );
   
  } catch (error) {
    console.log("Error while Fetching", error);
    return NextResponse.json(
      { message: "Error Occured While Fetching blogs." },
      { status: 500 }
    );
  }
}
