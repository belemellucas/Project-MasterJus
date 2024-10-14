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

    const courses = await prisma.cards.findMany({
      where: whereCondition,
    });
    return NextResponse.json(
      { message: "Courses Data", data: courses },
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
