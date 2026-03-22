import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URL) {
    throw new Error("MongoDB string is not provided !")
}


if(!process.env.JWT_SECRET){
    throw new Error("JWT secret is not provided !")
}

if(!process.env.GMAIL_REFRESH_TOKEN){
    throw new Error("Gmail secret token is required !")
}

if(!process.env.GMAIL_CLIENT_SECRET){
    throw new Error("Gmail client secret is required !")
}

if(!process.env.GMAIL_CLIENT_ID){
    throw new Error("Gmail client id is required !")
}

if(!process.env.USER_GMAIL){
    throw new Error("User email is required !")
}

const config = {
    MONGODB_URL: process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    GMAIL_REFRESH_TOKEN:process.env.GMAIL_REFRESH_TOKEN,
    GMAIL_CLIENT_SECRET:process.env.GMAIL_CLIENT_SECRET,
    GMAIL_CLIENT_ID:process.env.GMAIL_CLIENT_ID,
    USER_GMAIL:process.env.USER_GMAIL
    
}

export default config