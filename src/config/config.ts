import { config as dotenvConfig } from "dotenv";
dotenvConfig();

/**
 * GOOGLE_API_KEY: The Api key for the gemini model
 * MISTRAL_API_KEY: The Api key for the mistral model
 * COHERE_API_KEY: The Api key for the cohere model
 */


type Config = {
    readonly GOOGLE_API_KEY: string;
    readonly MISTRAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
};

const config: Config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
};

export default config;


