import { compileWelcomeTemplate, sendMail } from "../lib/mail";


export default function Email() {

    const send = async()=>{
        "use server"
        await sendMail({ 
            to: "lucaslopeskinha@gmail.com", 
            name: "Lukas", 
            subject: "Test Mail", 
            body: compileWelcomeTemplate("Lukas", "youtube.com")
        })
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
            <form>
                <button formAction={send}>Test</button>
            </form>
        </main>
    )
}