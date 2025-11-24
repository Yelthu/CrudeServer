// prisma.config.ts
import { defineConfig, env } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations',
    },
    datasource: {
        // Inside Docker → use "postgres" hostname
        // On your laptop → use "localhost"
        url:
            process.env.DATABASE_URL_DOCKER ||
            process.env.DATABASE_URL ||
            env('DATABASE_URL'),
    },
});