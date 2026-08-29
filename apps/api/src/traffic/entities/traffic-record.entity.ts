import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('traffic_records')
export class TrafficRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  country: string;

  @Index()
  @Column({ name: 'vehicle_type' })
  vehicleType: string;

  @Column('int')
  count: number;

  @Index()
  @Column({ name: 'recorded_at', type: 'timestamptz' })
  recordedAt: Date;
}
