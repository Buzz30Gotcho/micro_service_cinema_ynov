import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeanceController } from './seance.controller';
import { SeanceService } from './seance.service';
import { Seance } from '../entities/seance.entity';
import { Reservation } from '../entities/reservation.entity'; // Import Reservation entity

@Module({
  imports: [TypeOrmModule.forFeature([Seance, Reservation])],
  controllers: [SeanceController],
  providers: [SeanceService],
  exports: [SeanceService],
})
export class SeanceModule {}