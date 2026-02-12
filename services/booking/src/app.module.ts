import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Seance, Reservation } from './entities';
import { SeanceModule } from './seance/seance.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || "postgres",
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "booking_db",
      entities: [Seance, Reservation],
      synchronize: true,
    }),
    SeanceModule,
    ReservationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }