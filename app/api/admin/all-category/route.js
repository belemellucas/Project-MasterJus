import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  let queryData = req?.nextUrl?.searchParams?.get("query") || "";
  queryData = queryData?.toLowerCase();

  try {
    let whereCondition = {};

    if (queryData) {
      whereCondition = {
        category: {
          contains: queryData,
        },
      };
    }

    const categories = await prisma.catCurso.findMany({
      where: whereCondition,
    });
    return NextResponse.json(
      { message: "Categories Data", data: categories },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while Fetching", error);
    return NextResponse.json(
      { message: "Error Occured While Fetching categories." },
      { status: 500 }
    );
  }
}
