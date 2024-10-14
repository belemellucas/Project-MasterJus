import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req, res) {
  try {
    const {
      username,
      email,
      password,
      cpf,
      nome,
      celular,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    } = await req.json();

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (exists) {
      console.log("User already exists!");
      return NextResponse.json(
        { message: "Username or Email Already Exists." },
        {
          status: 500,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
        },
      });
      const lead = await prisma.userInfo.create({
    
        data: {
          userId: user.id,
          cpf: cpf,
          nome: nome,
          email: email,
          celular: celular,
          cep: cep,
          endereco: endereco,
          numero: numero,
          complemento: complemento,
          bairro: bairro,   
          cidade: cidade,
          estado: estado,
        },
      });
      return { user, lead };
    });
    

    return NextResponse.json({ message: "User Registered" }, { status: 201 });
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
