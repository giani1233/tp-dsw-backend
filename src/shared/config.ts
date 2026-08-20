function requerirVariable(nombre: string): string {
    const valor = process.env[nombre];
    if (!valor) {
        throw new Error(`La variable de entorno ${nombre} no está definida.`);
    } 
    return valor
}

export const config = {
    jwtSecret: requerirVariable('JWT_SECRET'),
    mpAccessToken: requerirVariable('MP_ACCESS_TOKEN'),
    emailHost: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    emailPort: Number(process.env.EMAIL_PORT) || 2525,
    emailUser: requerirVariable('EMAIL_USER'),
    emailPass: requerirVariable('EMAIL_PASS'),
    dbUrl: requerirVariable('DB_URL'),
}