import { config } from 'dotenv-safe';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export type Environment =
    | 'local'
    | 'development'
    | 'test'
    | 'staging'
    | 'production';

const environment = process.env.NODE_ENV;
function assertNodeEnv(env: string | undefined): asserts env {
    if (!env) {
        throw Error('NODE ENV must be specified');
    }
}

assertNodeEnv(environment);

const environmentsWithEnvFiles = ['local', 'test'];
if (environmentsWithEnvFiles.includes(environment)) {
    const envFiles = {
        example: join(__dirname, '../.env.example'),
        testing: join(__dirname, '../.env.local'),
        local: join(__dirname, '../.env.local'),
    };

    config({
        path: envFiles[environment] || envFiles.local,
        example: envFiles.example,
    });
}

interface IJwtOptions {
    secret: string;
    expiresIn: string;
}

interface ISessionOptions {
    secret: string;
    expiresIn: number;
}

class Config {
    static get sentryDsn(): string {
        return process.env.SENTRY_DSN as string;
    }

    static get environment(): Environment {
        return environment as Environment;
    }

    static get port(): string {
        return process.env.PORT as string;
    }

    static get swaggerPath(): string {
        return process.env.SWAGGER_PATH as string;
    }

    static get brandName(): string {
        return process.env.BRAND_NAME as string;
    }

    static get rateLimit(): number {
        return parseInt(process.env.REQUESTS_PER_MINUTE as string, 10);
    }

    static get database(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: false,
            keepConnectionAlive: true,
            logging: process.env.DATABASE_LOGGING as LoggerOptions,
        };
    }

    static get jwt(): IJwtOptions {
        return {
            secret: process.env.JWT_SECRET as string,
            expiresIn: process.env.JWT_EXPIRATION_TIME as string,
        };
    }

    static get allowedOrigins(): string[] {
        return process.env.ALLOWED_ORIGINS.split(',').filter(
            origin => !!origin,
        );
    }

    static get mandrillApiKey(): string {
        return process.env.MANDRILL_API_KEY as string;
    }

    static get mailFrom(): string {
        return process.env.MAIL_FROM as string;
    }

    static get redisUrl(): string {
        return process.env.REDIS_URL as string;
    }

    static get session(): ISessionOptions {
        return {
            secret: process.env.SESSION_SECRET as string,
            expiresIn: parseInt(process.env.SESSION_TTL as string),
        };
    }
}

export { Config };
