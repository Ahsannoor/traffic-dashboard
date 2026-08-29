// apps/api/src/traffic/traffic.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { TrafficRecord } from './entities/traffic-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficRecord])],
  controllers: [TrafficController],
  providers: [TrafficService],
  exports: [TrafficService],
})
export class TrafficModule {}
