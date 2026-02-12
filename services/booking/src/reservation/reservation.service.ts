import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { ReservationDto } from '../dto/reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) { }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['seance'] });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['seance'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }


  async findAllByEmail(email: string): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      where: { email },
      relations: ['seance'],
    });

    if (!reservations || reservations.length === 0) {
      throw new NotFoundException(`No reservations found for ${email}`);
    }

    return reservations;
  }



  async create(reservationDto: ReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(reservationDto);
    return this.reservationRepository.save(reservation);
  }

  async update(id: string, reservationDto: Partial<ReservationDto>): Promise<Reservation> {
    await this.findOne(id);
    await this.reservationRepository.update(id, reservationDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }
}
