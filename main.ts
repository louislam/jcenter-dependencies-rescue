import * as path from "jsr:@std/path@^1.1.1";
import * as fs from "jsr:@std/fs@^1.0.19";

export async function main() {
    /**
     * Upstream JCenter Mirror
     */
    const upstreamURL = "https://maven.aliyun.com/repository/jcenter";

    /**
     * Local data directory
     * This is where the downloaded files will be stored.
     */
    const dataDir = "./data";

    Deno.serve(async (req) => {
        const url = new URL(req.url);
        const headers = new Headers(req.headers);
        const requestURL = `${upstreamURL}${url.pathname}`;
        const filePath = path.join(dataDir, url.pathname);

        console.log(`Requesting: ${requestURL}`);

        // Check if cached
        if (await fs.exists(filePath)) {
            console.log(`Cache hit: ${filePath}`);
            try {
                const file = await Deno.readFile(filePath);
                return new Response(file, {
                    headers: { "Content-Type": "application/octet-stream" },
                });
            } catch (error) {
                console.error(`Error reading cached file: ${filePath}, continue to fetch from upstream`, error);
            }
        }

        // Fetch from upstream
        const response = await fetch(requestURL, {
            method: req.method,
            headers: headers,
            body: req.body,
        });

        // Cache the file
        if (response.ok) {
            const dir = path.dirname(filePath);
            await Deno.mkdir(dir, { recursive: true });
            const arrayBuffer = await response.arrayBuffer();
            await Deno.writeFile(filePath, new Uint8Array(arrayBuffer));
            return new Response(arrayBuffer, {
                headers: response.headers,
            });
        }

        return response;
    });
}

if (import.meta.main) {
    await main();
}
