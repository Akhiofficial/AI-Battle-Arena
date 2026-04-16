import dotenv from 'dotenv'
import path from 'path';

// Load from root .env
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    MISTRALAI_API_KEY: process.env.MISTRAL_API_KEY || '', // Mapped to the standard name in our .env
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
    MONGO_URI: process.env.MONGO_URI || '',
}


export default config