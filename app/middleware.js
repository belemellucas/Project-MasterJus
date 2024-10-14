export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/', '/admin', '/blogs/add-blog', '/blogs/update-blog/*'],
}