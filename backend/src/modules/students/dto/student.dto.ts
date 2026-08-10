import {
  IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches,
} from 'class-validator';

export class StudentRegisterDto {
  @IsString() @MaxLength(20)
  studentId: string;            // must match a StudentRecord

  @IsEmail()
  email: string;

  @IsString() @MinLength(8) @MaxLength(64)
  password: string;

  @IsOptional() @IsString() @MaxLength(100)
  phone?: string;
}

export class StudentLoginDto {
  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;
}

export class ImportStudentsDto {
  // rows parsed from Excel — validated in service
  rows: { studentId: string; name: string; session: string }[];
}
