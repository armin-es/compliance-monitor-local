const token = import.meta.env.VITE_HUGGINGFACE_API_TOKEN as string | undefined;

if (!token) {
  throw new Error("VITE_HUGGINGFACE_API_TOKEN is not set. Copy .env.example to .env.local and add your token.");
}

export const env = {
  HUGGINGFACE_API_TOKEN: token,
};
