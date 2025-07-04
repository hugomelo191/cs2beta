import postgres from 'postgres';
import * as schema from '../db/schema.js';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export declare const testConnection: () => Promise<boolean>;
//# sourceMappingURL=database.d.ts.map