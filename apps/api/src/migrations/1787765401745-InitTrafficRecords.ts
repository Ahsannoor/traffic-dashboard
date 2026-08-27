import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTrafficRecords1787765401745 implements MigrationInterface {
    name = 'InitTrafficRecords1787765401745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "traffic_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "vehicle_type" character varying NOT NULL, "count" integer NOT NULL, "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_046b9e32b44b3b3bd85015711a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9e9c3f98e836538b8cf0f07292" ON "traffic_records"  ("country") `);
        await queryRunner.query(`CREATE INDEX "IDX_6b9d4faf54414a148a0ec17bde" ON "traffic_records"  ("vehicle_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e1a23b4d6f5fbdea83cbff6d" ON "traffic_records"  ("recorded_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_24e1a23b4d6f5fbdea83cbff6d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6b9d4faf54414a148a0ec17bde"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e9c3f98e836538b8cf0f07292"`);
        await queryRunner.query(`DROP TABLE "traffic_records"`);
    }

}
