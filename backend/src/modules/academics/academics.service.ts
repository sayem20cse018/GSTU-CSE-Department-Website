import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Program, ProgramDocument }                     from './schemas/program.schema';
import { Course, CourseDocument }                        from './schemas/course.schema';
import { AcademicResource, AcademicResourceDocument }    from './schemas/academic-resource.schema';
import { Laboratory, LaboratoryDocument }                from './schemas/laboratory.schema';

import type { CreateProgramDto, UpdateProgramDto }               from './dto/program.dto';
import type { CreateCourseDto, UpdateCourseDto }                 from './dto/course.dto';
import type { CreateAcademicResourceDto, UpdateAcademicResourceDto } from './dto/academic-resource.dto';
import type { CreateLaboratoryDto, UpdateLaboratoryDto }         from './dto/laboratory.dto';

// ─────────────────────────────────────────────────────────────────────────────
//  PROGRAM
// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class AcademicsService {
  constructor(
    @InjectModel(Program.name)          private programModel: Model<ProgramDocument>,
    @InjectModel(Course.name)           private courseModel: Model<CourseDocument>,
    @InjectModel(AcademicResource.name) private resourceModel: Model<AcademicResourceDocument>,
    @InjectModel(Laboratory.name)       private labModel: Model<LaboratoryDocument>,
  ) {}

  // ── Programs ────────────────────────────────────────────────────────────────
  async findAllPrograms(isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    return this.programModel.find(filter).sort({ sortOrder: 1, degree: 1 }).lean();
  }

  async findProgramByDegree(degree: string) {
    const p = await this.programModel.findOne({ degree, isActive: true }).lean();
    if (!p) throw new NotFoundException(`Program "${degree}" not found`);
    return p;
  }

  async findProgramById(id: string) {
    const p = await this.programModel.findById(id).lean();
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    return p;
  }

  async createProgram(dto: CreateProgramDto) {
    return this.programModel.create(dto);
  }

  async updateProgram(id: string, dto: UpdateProgramDto) {
    const p = await this.programModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    return p;
  }

  async deleteProgram(id: string) {
    const p = await this.programModel.findByIdAndDelete(id);
    if (!p) throw new NotFoundException(`Program ${id} not found`);
  }

  // ── Courses ─────────────────────────────────────────────────────────────────
  async findAllCourses(degree?: string, semester?: number, isAdmin = false) {
    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.isActive = true;
    if (degree)   filter.degree   = degree;
    if (semester) filter.semester = semester;
    return this.courseModel.find(filter).sort({ semester: 1, sortOrder: 1, code: 1 }).lean();
  }

  async findCourseById(id: string) {
    const c = await this.courseModel.findById(id).lean();
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    return c;
  }

  async findCourseByCode(code: string) {
    const c = await this.courseModel.findOne({ code: code.toUpperCase() }).lean();
    if (!c) throw new NotFoundException(`Course "${code}" not found`);
    return c;
  }

  async createCourse(dto: CreateCourseDto) {
    return this.courseModel.create(dto);
  }

  async updateCourse(id: string, dto: UpdateCourseDto) {
    const c = await this.courseModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    return c;
  }

  async deleteCourse(id: string) {
    const c = await this.courseModel.findByIdAndDelete(id);
    if (!c) throw new NotFoundException(`Course ${id} not found`);
  }

  // Curriculum: courses grouped by degree → semester
  async getCurriculum(degree: string) {
    const courses = await this.courseModel
      .find({ degree, isActive: true })
      .sort({ semester: 1, sortOrder: 1, code: 1 })
      .lean();

    // Group by semester
    const grouped: Record<number, typeof courses> = {};
    for (const c of courses) {
      if (!grouped[c.semester]) grouped[c.semester] = [];
      grouped[c.semester].push(c);
    }
    return grouped;
  }

  // ── Academic Resources ──────────────────────────────────────────────────────
  async findAllResources(type?: string, degree?: string, isAdmin = false) {
    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.isPublished = true;
    if (type)   filter.type          = type;
    if (degree) filter.targetDegree  = { $in: [degree, 'all'] };
    return this.resourceModel.find(filter).sort({ isPinned: -1, sortOrder: 1, createdAt: -1 }).lean();
  }

  async findResourceById(id: string) {
    const r = await this.resourceModel.findById(id).lean();
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
    return r;
  }

  async createResource(dto: CreateAcademicResourceDto) {
    return this.resourceModel.create(dto);
  }

  async updateResource(id: string, dto: UpdateAcademicResourceDto) {
    const r = await this.resourceModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
    return r;
  }

  async deleteResource(id: string) {
    const r = await this.resourceModel.findByIdAndDelete(id);
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
  }

  // ── Laboratories ────────────────────────────────────────────────────────────
  async findAllLabs(isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    return this.labModel.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  }

  async findLabBySlug(slug: string) {
    const lab = await this.labModel.findOne({ slug }).lean();
    if (!lab) throw new NotFoundException(`Lab "${slug}" not found`);
    return lab;
  }

  async findLabById(id: string) {
    const lab = await this.labModel.findById(id).lean();
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
    return lab;
  }

  async createLab(dto: CreateLaboratoryDto) {
    return this.labModel.create(dto);
  }

  async updateLab(id: string, dto: UpdateLaboratoryDto) {
    const lab = await this.labModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
    return lab;
  }

  async deleteLab(id: string) {
    const lab = await this.labModel.findByIdAndDelete(id);
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
  }

  // ── Stats (for admin dashboard) ─────────────────────────────────────────────
  async getStats() {
    const [programs, courses, resources, labs] = await Promise.all([
      this.programModel.countDocuments({ isActive: true }),
      this.courseModel.countDocuments({ isActive: true }),
      this.resourceModel.countDocuments({ isPublished: true }),
      this.labModel.countDocuments({ isActive: true }),
    ]);
    return { programs, courses, resources, labs };
  }
}
