import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { SeanceDto } from '../dto/seance.dto';
import { SeanceService } from './seance.service';
import { Seance } from '../entities/seance.entity';

@Controller('sessions')
export class SeanceController {
  constructor(private readonly seanceService: SeanceService) {}

  @Get()
  async findAll(): Promise<Seance[]> {
    return this.seanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Seance> {
    return this.seanceService.findOne(id);
  }

  @Get(':id/occupied-seats')
  async findOccupiedSeats(@Param('id') id: string): Promise<string[]> {
    return this.seanceService.findOccupiedSeats(id);
  }

  @Post()
  async create(@Body() seanceDto: SeanceDto): Promise<Seance> {
    return this.seanceService.create(seanceDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() seanceDto: Partial<SeanceDto>): Promise<Seance> {
    return this.seanceService.update(id, seanceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.seanceService.delete(id);
    return { message: 'Seance deleted successfully!' };
  }
}
