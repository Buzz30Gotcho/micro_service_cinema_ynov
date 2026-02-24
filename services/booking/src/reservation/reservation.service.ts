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

  async findAll(): Promise<any[]> {
    const reservations = await this.reservationRepository.find({ relations: ['seance'] });
    return reservations.map(r => this.toClientShape(r));
  }

  async findOne(id: string): Promise<any> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['seance'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return this.toClientShape(reservation);
  }


  async findAllByEmail(email: string): Promise<any[]> {
    const reservations = await this.reservationRepository.find({
      where: { email },
      relations: ['seance'],
    });

    if (!reservations || reservations.length === 0) {
      return [];
    }

    return reservations.map(r => this.toClientShape(r));
  }

  private toClientShape(reservation: Reservation) {
    const seance = reservation.seance || null;

    const clientSeance = seance
      ? {
        movieId: (seance as any).movieId || null,
        room: seance.salleId || null,
        dateTime: seance.dateSeance && seance.hourStart ? `${seance.dateSeance}T${seance.hourStart}` : seance.dateSeance || null,
        posterPath: (seance as any).posterPath || null,
        price: seance.price !== undefined && seance.price !== null ? Number(seance.price) : null,
        id: seance.id,
        nameMovie: seance.nameMovie,
        numberPlace: seance.numberPlace,
        hourStart: seance.hourStart,
        hourEnd: seance.hourEnd,
        dateSeance: seance.dateSeance,
        salleId: seance.salleId,
      }
      : null;

    return {
      id: reservation.id,
      name: reservation.name,
      email: reservation.email,
      seatNumber: reservation.seatNumber,
      seanceId: reservation.seanceId,
      seance: clientSeance,
    };
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
