import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src-tauri', 'icons');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Minimal 1x1 transparent ICO file base64
const icoBase64 = "AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

fs.writeFileSync(path.join(dir, 'icon.ico'), Buffer.from(icoBase64, 'base64'));
console.log("icon.ico created successfully in src-tauri/icons/");
