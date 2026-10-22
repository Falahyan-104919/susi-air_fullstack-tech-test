import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import defaultFlightHours from '../../data/mock-flight-hours.json';
import defaultDocuments from '../../data/mock-documents.json';
import defaultSchedules from '../../data/mock-schedules.json';
import {
  PilotProfile,
  ChartBoundsConfig,
  DocumentEntry,
  ScheduleEntry,
  LegendItem,
} from '../types';

@Injectable()
export class DataService implements OnModuleInit {
  private readonly logger = new Logger(DataService.name);
  private pilotProfile: PilotProfile;
  private flightHoursMap: Map<string, number> = new Map();
  private limits: Record<string, number> = {};
  private chartBounds: Record<string, ChartBoundsConfig> = {};
  private documents: DocumentEntry[] = [];
  private warningDays: number = 30;
  private schedules: ScheduleEntry[] = [];
  private legends: LegendItem[] = [];

  onModuleInit() {
    this.logger.log('Seeding in-memory datasets from JSON...');
    this.loadFlightHours();
    this.loadDocuments();
    this.loadSchedules();
    this.logger.log(`Seeding complete. Flight hours indexed: ${this.flightHoursMap.size}`);
  }

  private resolveDataPath(filename: string): string {
    const candidates = [
      path.join(__dirname, '../../data', filename),
      path.join(__dirname, '../data', filename),
      path.join(__dirname, 'data', filename),
      path.join(process.cwd(), 'data', filename),
      path.join(process.cwd(), 'nest/data', filename),
      path.join(process.cwd(), 'materials', filename),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    throw new Error(`[FATAL] Required seed dataset "${filename}" not found in any candidate paths: ${candidates.join(', ')}`);
  }

  private loadFlightHours() {
    let raw: any;
    try {
      const filePath = this.resolveDataPath('mock-flight-hours.json');
      raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      raw = defaultFlightHours;
    }
    this.pilotProfile = {
      name: raw.pilot.name,
      totalFlightHours: raw.pilot.totalFlightHours,
      avatarUrl:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    };
    this.limits = raw.limits;
    this.chartBounds = raw.chartBounds;
    for (const item of raw.flightHours) {
      this.flightHoursMap.set(item.date, item.hours);
    }
  }

  private loadDocuments() {
    let raw: any;
    try {
      const filePath = this.resolveDataPath('mock-documents.json');
      raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      raw = defaultDocuments;
    }
    this.warningDays = raw.thresholds?.warningDays || 30;
    this.documents = raw.documents;
  }

  private loadSchedules() {
    let raw: any;
    try {
      const filePath = this.resolveDataPath('mock-schedules.json');
      raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      raw = defaultSchedules;
    }
    this.schedules = raw.schedules;
    this.legends = raw.legend;
  }

  getPilotProfile(): PilotProfile {
    return this.pilotProfile;
  }

  getFlightHoursMap(): Map<string, number> {
    return this.flightHoursMap;
  }

  /**
   * Query flight hours for a specific date (YYYY-MM-DD).
   * Missing dates or pre-inception dates return 0.
   */
  getFlightHoursForDate(date: string): number {
    return this.flightHoursMap.get(date) || 0;
  }

  getFlightHoursCount(): number {
    return this.flightHoursMap.size;
  }

  getLimits(): Record<string, number> {
    return this.limits;
  }

  getChartBounds(): Record<string, ChartBoundsConfig> {
    return this.chartBounds;
  }

  getDocuments(): DocumentEntry[] {
    return this.documents;
  }

  getWarningDays(): number {
    return this.warningDays;
  }

  getSchedules(): ScheduleEntry[] {
    return this.schedules;
  }

  /**
   * Query schedule entries for a specific YYYY-MM month prefix.
   */
  findSchedulesByMonth(prefix: string): ScheduleEntry[] {
    return this.schedules.filter((s) => s.duty_date.startsWith(prefix));
  }

  getLegends(): LegendItem[] {
    return this.legends;
  }
}
