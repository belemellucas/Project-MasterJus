import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('imageUrl'); 

    try {
        const adjustments = await prisma.imageAdjustments.findUnique({
             where: { imageUrl }, 
        }); 

        if (adjustments) {
            return NextResponse.json(adjustments);
          } else {
            return NextResponse.json(null);
          }

    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar os ajustes' }, { status: 500 });
    }
}