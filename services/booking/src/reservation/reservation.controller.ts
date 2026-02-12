import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { ReservationDto } from '../dto/reservation.dto';
import { ReservationService } from './reservation.service';
import { Reservation } from '../entities/reservation.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Protéger cette route si elle est pour l'admin
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async findMyBookings(@Request() req): Promise<Reservation[]> {
    const email = req.user.email; // récupéré depuis le JWT
    return this.reservationService.findAllByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Reservation> {
    return this.reservationService.findOne(id);
  }

  @Post()
  async create(@Body() reservationDto: ReservationDto): Promise<Reservation> {
    return this.reservationService.create(reservationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Protéger la suppression de réservation
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.reservationService.delete(id);
    return { message: 'Reservation cancelled successfully!' };
  }
}
