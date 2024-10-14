import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/utils/authOptions";
import Initial from "./components/initial/Initial";
import Whatsapp from "./components/Buttons/whatsapp";
import Depositions from "./components/depositions/Depositions";
import VideoComponent from "./components/video/VideoComponent";
import Cards from "./courses/page";
//import MyUser from "./api/my-user/route";
export default async function Home({ searchParams }) {
  const session = await getServerSession(authOptions);

  const prisma = new PrismaClient();

  const infoSite = await prisma.infoSite.findMany();

  const depositions = await prisma.depoimento.findMany({
    where: {
      approved: true
    }
  });
   const user = session ? await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
   }) : null
   
  return (
    <>
      <Initial infoSite={infoSite} />
      <Cards searchParams={searchParams} />
      <VideoComponent infoSite={infoSite} />
      <Depositions depositions={depositions} user={user} session={session} /> 
    </>
  );
}
