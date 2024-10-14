/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: false,
        domains: [
            'avatars.githubusercontent.com', 
            'www.masterjus.com.br', 
            'images.pexels.com', 
            'www.wordstream.com',
            'res.cloudinary.com'
        ]
    },
   
}

module.exports = nextConfig
