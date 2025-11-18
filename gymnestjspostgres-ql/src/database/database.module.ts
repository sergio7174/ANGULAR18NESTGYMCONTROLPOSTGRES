// src/database/database.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Module({
  providers: [
    {
      provide: 'PG_CLIENT',
      useFactory: async () => {
        const client = new Client({
          user: 'postgres',
          host: 'localhost',
          database: process.env.POSTGRES_DATABASE,
          password: 'sergio7174',
          port: 5432,
        });

        try {
          await client.connect();
          console.log(
            'PostgreSQL database connected successfully!: ',
            `${process.env.POSTGRES_DATABASE}`,
          );
          return client;
        } catch (error) {
          console.error(
            'Error connecting to PostgreSQL database:',
            error.message,
          );
          throw error; // Re-throw to prevent app from starting with a broken connection
        }
      },
    },
  ],
  exports: ['PG_CLIENT'], // Export the client for use in other modules
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    // This method is called once the module has been initialized.
    // The connection status will already be logged by the useFactory.
  }
}
