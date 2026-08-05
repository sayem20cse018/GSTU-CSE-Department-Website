import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type AdminDocument = HydratedDocument<Admin>;

// ─── Sub-schema: Activity Log entry ───────────────────────────────────────────
@Schema({ _id: false })
class ActivityLog {
  @Prop({ required: true })
  action: string; // e.g. 'LOGIN', 'UPDATE_FACULTY', 'DELETE_NEWS'

  @Prop({ default: Date.now })
  performedAt: Date;

  @Prop()
  ipAddress: string;
}
const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,           // adds createdAt, updatedAt automatically
  collection: 'admins',
})
export class Admin {
  // ── Identity ────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  })
  email: string;

  @Prop({
    required: [true, 'Password hash is required'],
    select: false,           // never returned in queries unless explicitly selected
  })
  passwordHash: string;

  // ── Role & Permissions ───────────────────────────────────────────────────────
  @Prop({
    required: true,
    enum: {
      values: ['super_admin', 'admin', 'editor'],
      message: 'Role must be super_admin, admin, or editor',
    },
    default: 'editor',
  })
  role: string;
  /*
   * Role hierarchy:
   *   super_admin → full access (create/delete admins, all content)
   *   admin       → manage all content, cannot manage other admins
   *   editor      → create/edit content, cannot delete or publish
   */

  @Prop({
    type: [String],
    enum: ['manage_faculty', 'manage_news', 'manage_events',
           'manage_notice', 'manage_gallery', 'manage_alumni',
           'manage_research', 'manage_admins'],
    default: [],
  })
  permissions: string[];     // fine-grained permissions on top of role

  // ── Status ───────────────────────────────────────────────────────────────────
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  // ── Security ─────────────────────────────────────────────────────────────────
  @Prop({ select: false })
  passwordResetToken: string;

  @Prop({ select: false })
  passwordResetExpires: Date;

  @Prop({ default: 0, select: false })
  failedLoginAttempts: number;

  @Prop({ select: false })
  lockedUntil: Date;          // account lock after N failed attempts

  @Prop()
  lastLoginAt: Date;

  @Prop()
  lastLoginIp: string;

  // ── Audit Log ─────────────────────────────────────────────────────────────────
  @Prop({ type: [ActivityLogSchema], default: [], select: false })
  activityLog: ActivityLog[];
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const AdminSchema = SchemaFactory.createForClass(Admin);

// email unique index is already enforced by `unique: true` on the @Prop above
AdminSchema.index({ role: 1, isActive: 1 });
