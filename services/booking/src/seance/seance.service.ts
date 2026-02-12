import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seance } from '../entities/seance.entity';
import { Reservation } from '../entities/reservation.entity'; // Import Reservation entity
import { SeanceDto } from '../dto/seance.dto';

@Injectable()
export class SeanceService {
  constructor(
    @InjectRepository(Seance)
    private readonly seanceRepository: Repository<Seance>,
    @InjectRepository(Reservation) // Inject Reservation Repository
    private readonly reservationRepository: Repository<Reservation>, // To fetch specific reservation details if needed, or simply rely on Seance.reservations
  ) {}

  async findAll(): Promise<Seance[]> {
    return this.seanceRepository.find({ relations: ['reservations'] });
  }

  async findOne(id: string): Promise<Seance> {
    const seance = await this.seanceRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!seance) {
      throw new NotFoundException(`Seance with ID ${id} not found`);
    }
    return seance;
  }

  async create(seanceDto: SeanceDto): Promise<Seance> {
    const seance = this.seanceRepository.create(seanceDto);
    return this.seanceRepository.save(seance);
  }

  async update(id: string, seanceDto: Partial<SeanceDto>): Promise<Seance> {
    await this.findOne(id);
    await this.seanceRepository.update(id, seanceDto);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.seanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Seance with ID ${id} not found`);
    }
  }

  async findOccupiedSeats(seanceId: string): Promise<string[]> {
    const seance = await this.seanceRepository.findOne({
      where: { id: seanceId },
      relations: ['reservations'], // Assurez-vous que les réservations sont chargées
    });

    if (!seance) {
      throw new NotFoundException(`Seance with ID ${seanceId} not found`);
    }

    const occupiedSeats: string[] = [];
    seance.reservations.forEach(reservation => {
      if (reservation.seatNumber) {
        occupiedSeats.push(reservation.seatNumber);
      }
    });

    return [...new Set(occupiedSeats)]; // Retourne les places uniques
  }
}
