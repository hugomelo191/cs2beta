import postgres from 'postgres';
import * as schema from './schema.js';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
declare let redis: any;
export { redis };
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=connection.d.ts.map