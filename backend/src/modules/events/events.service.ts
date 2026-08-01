import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<EventDocument>) {}

  async findUpcoming(): Promise<Event[]> {
    return this.eventModel
      .find({ isPublished: true, startDate: { $gte: new Date() } })
      .sort({ startDate: 1 })
      .limit(10)
      .exec();
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.eventModel.find({ isPublished: true }).sort({ startDate: -1 }).skip(skip).limit(limit).exec(),
      this.eventModel.countDocuments({ isPublished: true }),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventModel.findOne({ slug, isPublished: true }).exec();
    if (!event) throw new NotFoundException(`Event "${slug}" not found`);
    return event;
  }
}
