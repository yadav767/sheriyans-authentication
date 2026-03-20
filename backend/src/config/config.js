import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URL) {
    throw new Error("MongoDB string is not provided !")
}


if(!process.env.JWT_SECRET){
    throw new Error("JWT secret is not provided !")
}



const config = {
    MONGODB_URL: process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET
}

export default config