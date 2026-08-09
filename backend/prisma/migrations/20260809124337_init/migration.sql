-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "admin_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "designation" TEXT NOT NULL,
    "title" TEXT,
    "shortBio" TEXT,
    "fullBio" TEXT,
    "slug" TEXT,
    "officeRoom" TEXT,
    "researchInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "courses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "websiteUrl" TEXT,
    "googleScholarUrl" TEXT,
    "linkedinUrl" TEXT,
    "researchGateUrl" TEXT,
    "orcidId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "employmentStatus" TEXT NOT NULL DEFAULT 'full_time',
    "staffType" TEXT NOT NULL DEFAULT 'faculty',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_education" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "faculty_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_publications" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'journal',
    "doi" TEXT,
    "url" TEXT,

    CONSTRAINT "faculty_publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_awards" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "awardedBy" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "faculty_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_office_hours" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "faculty_office_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "relatedNewsIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoMetaTitle" TEXT,
    "seoMetaDescription" TEXT,
    "seoOgImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetAudience" TEXT[] DEFAULT ARRAY['all']::TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "postedById" TEXT,
    "postedByName" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_attachments" (
    "id" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "coverImage" TEXT,
    "type" TEXT NOT NULL DEFAULT 'seminar',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "venue" TEXT NOT NULL,
    "venueMapUrl" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'in_person',
    "onlineLink" TEXT,
    "organizerId" TEXT,
    "organizerName" TEXT,
    "organizerContact" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "regIsRequired" BOOLEAN NOT NULL DEFAULT false,
    "regFormUrl" TEXT,
    "regDeadline" TIMESTAMP(3),
    "regMaxSeats" INTEGER NOT NULL DEFAULT 0,
    "regRegisteredCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_speakers" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "organization" TEXT,
    "photo" TEXT,
    "bio" TEXT,

    CONSTRAINT "event_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_schedule_items" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "speaker" TEXT,

    CONSTRAINT "event_schedule_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'event',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImage" TEXT,
    "albumDate" TIMESTAMP(3) NOT NULL,
    "uploadedById" TEXT,
    "uploadedByName" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "mediaCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_media_items" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "caption" TEXT,
    "altText" TEXT,
    "format" TEXT,
    "fileSizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_media_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_group_projects" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fundingBody" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "startYear" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "research_group_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT,
    "phone" TEXT,
    "currentCity" TEXT,
    "currentCountry" TEXT,
    "batchYear" INTEGER,
    "graduationYear" INTEGER,
    "degree" TEXT,
    "studentId" TEXT,
    "cgpa" TEXT,
    "currentDesignation" TEXT,
    "currentOrganization" TEXT,
    "industry" TEXT NOT NULL DEFAULT 'other',
    "testimonial" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "websiteUrl" TEXT,
    "isProfilePublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "willingToMentor" BOOLEAN NOT NULL DEFAULT false,
    "willingToSpeak" BOOLEAN NOT NULL DEFAULT false,
    "mentorshipTopics" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_work_experience" (
    "id" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,

    CONSTRAINT "alumni_work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_higher_education" (
    "id" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT,
    "year" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "alumni_higher_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni_achievements" (
    "id" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,

    CONSTRAINT "alumni_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalSeats" INTEGER NOT NULL DEFAULT 0,
    "tuitionFee" TEXT,
    "brochureUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_admission_requirements" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "program_admission_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_career_opportunities" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "program_career_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT,
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "syllabusUrl" TEXT,
    "teacherName" TEXT,
    "theoryHours" INTEGER NOT NULL DEFAULT 0,
    "labHours" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_weekly_schedules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,

    CONSTRAINT "course_weekly_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "targetDegree" TEXT NOT NULL DEFAULT 'all',
    "academicYear" TEXT NOT NULL,
    "term" TEXT NOT NULL DEFAULT 'Spring',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_resource_files" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'pdf',
    "fileSizeBytes" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_resource_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "location" TEXT NOT NULL,
    "capacity" INTEGER,
    "workstations" INTEGER,
    "inCharge" TEXT,
    "inChargeEmail" TEXT,
    "labType" TEXT NOT NULL DEFAULT 'both',
    "softwareInstalled" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_equipment" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER,
    "specification" TEXT,

    CONSTRAINT "laboratory_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_images" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "laboratory_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_schedules" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "courseCode" TEXT,
    "group" TEXT,

    CONSTRAINT "laboratory_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "type" TEXT NOT NULL DEFAULT 'student',
    "achievedAt" TIMESTAMP(3) NOT NULL,
    "achieverName" TEXT,
    "awardedBy" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "logo" TEXT,
    "coverImage" TEXT,
    "founderName" TEXT,
    "presidentName" TEXT,
    "advisorName" TEXT,
    "foundedYear" INTEGER,
    "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT,
    "websiteUrl" TEXT,
    "facebookUrl" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "overlayOpacity" INTEGER NOT NULL DEFAULT 60,
    "primaryBtnLabel" TEXT NOT NULL DEFAULT '',
    "primaryBtnHref" TEXT NOT NULL DEFAULT '',
    "secondaryBtnLabel" TEXT NOT NULL DEFAULT '',
    "secondaryBtnHref" TEXT NOT NULL DEFAULT '',
    "align" TEXT NOT NULL DEFAULT 'left',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'site_settings',
    "deptName" TEXT NOT NULL DEFAULT 'Department of Computer Science & Engineering',
    "deptShortName" TEXT NOT NULL DEFAULT 'Dept. of CSE',
    "universityName" TEXT NOT NULL DEFAULT 'Gopalganj Science & Technology University',
    "universityShortName" TEXT NOT NULL DEFAULT 'GSTU',
    "tagline" TEXT NOT NULL DEFAULT 'Advancing Computing, Shaping the Future',
    "deptLogo" TEXT,
    "universityLogo" TEXT,
    "email" TEXT NOT NULL DEFAULT 'cse@gstu.edu.bd',
    "phone" TEXT NOT NULL DEFAULT '+880-468-XXXXXX',
    "address" TEXT NOT NULL DEFAULT 'CSE Building, GSTU Campus, Gopalganj-8100, Bangladesh',
    "moodleUrl" TEXT NOT NULL DEFAULT 'https://moodle.gstu.edu.bd',
    "facebookUrl" TEXT NOT NULL DEFAULT 'https://facebook.com/gstu.cse',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "foundedYear" INTEGER NOT NULL DEFAULT 2011,
    "footerText" TEXT NOT NULL DEFAULT '',
    "aboutIntro" TEXT NOT NULL DEFAULT '',
    "aboutVision" TEXT NOT NULL DEFAULT '',
    "aboutMission" TEXT NOT NULL DEFAULT '',
    "aboutHistory" TEXT NOT NULL DEFAULT '',
    "chairmanName" TEXT NOT NULL DEFAULT 'Dr. Mrinal Kanti Baowaly',
    "chairmanTitle" TEXT NOT NULL DEFAULT 'Professor & Chairman',
    "chairmanPhoto" TEXT NOT NULL DEFAULT '',
    "chairmanEmail" TEXT NOT NULL DEFAULT 'baowaly@gmail.com',
    "chairmanEmail2" TEXT NOT NULL DEFAULT 'baowaly@gstu.edu.bd',
    "chairmanMessage" TEXT NOT NULL DEFAULT '',
    "aboutImage1" TEXT NOT NULL DEFAULT '',
    "aboutImage2" TEXT NOT NULL DEFAULT '',
    "aboutImage3" TEXT NOT NULL DEFAULT '',
    "aboutImage4" TEXT NOT NULL DEFAULT '',
    "hiddenNavItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customNavItems" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_role_isActive_idx" ON "admins"("role", "isActive");

-- CreateIndex
CREATE INDEX "admin_activity_logs_adminId_idx" ON "admin_activity_logs"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_slug_key" ON "faculty"("slug");

-- CreateIndex
CREATE INDEX "faculty_isActive_sortOrder_idx" ON "faculty"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "faculty_staffType_idx" ON "faculty"("staffType");

-- CreateIndex
CREATE INDEX "faculty_education_facultyId_idx" ON "faculty_education"("facultyId");

-- CreateIndex
CREATE INDEX "faculty_publications_facultyId_idx" ON "faculty_publications"("facultyId");

-- CreateIndex
CREATE INDEX "faculty_awards_facultyId_idx" ON "faculty_awards"("facultyId");

-- CreateIndex
CREATE INDEX "faculty_office_hours_facultyId_idx" ON "faculty_office_hours"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_isPublished_publishedAt_idx" ON "news"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "news_isFeatured_isPublished_idx" ON "news"("isFeatured", "isPublished");

-- CreateIndex
CREATE INDEX "news_category_isPublished_idx" ON "news"("category", "isPublished");

-- CreateIndex
CREATE INDEX "notices_isPublished_isPinned_publishedAt_idx" ON "notices"("isPublished", "isPinned", "publishedAt");

-- CreateIndex
CREATE INDEX "notices_category_isPublished_idx" ON "notices"("category", "isPublished");

-- CreateIndex
CREATE INDEX "notice_attachments_noticeId_idx" ON "notice_attachments"("noticeId");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_isPublished_startDate_idx" ON "events"("isPublished", "startDate");

-- CreateIndex
CREATE INDEX "events_isFeatured_isPublished_idx" ON "events"("isFeatured", "isPublished");

-- CreateIndex
CREATE INDEX "events_status_isPublished_idx" ON "events"("status", "isPublished");

-- CreateIndex
CREATE INDEX "event_speakers_eventId_idx" ON "event_speakers"("eventId");

-- CreateIndex
CREATE INDEX "event_schedule_items_eventId_idx" ON "event_schedule_items"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "galleries_slug_key" ON "galleries"("slug");

-- CreateIndex
CREATE INDEX "galleries_isPublished_albumDate_idx" ON "galleries"("isPublished", "albumDate");

-- CreateIndex
CREATE INDEX "galleries_isFeatured_isPublished_idx" ON "galleries"("isFeatured", "isPublished");

-- CreateIndex
CREATE INDEX "galleries_category_isPublished_idx" ON "galleries"("category", "isPublished");

-- CreateIndex
CREATE INDEX "gallery_media_items_galleryId_idx" ON "gallery_media_items"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "research_groups_slug_key" ON "research_groups"("slug");

-- CreateIndex
CREATE INDEX "research_group_projects_groupId_idx" ON "research_group_projects"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_email_key" ON "alumni"("email");

-- CreateIndex
CREATE INDEX "alumni_batchYear_idx" ON "alumni"("batchYear");

-- CreateIndex
CREATE INDEX "alumni_approvalStatus_isProfilePublic_idx" ON "alumni"("approvalStatus", "isProfilePublic");

-- CreateIndex
CREATE INDEX "alumni_isFeatured_isVerified_idx" ON "alumni"("isFeatured", "isVerified");

-- CreateIndex
CREATE INDEX "alumni_work_experience_alumniId_idx" ON "alumni_work_experience"("alumniId");

-- CreateIndex
CREATE INDEX "alumni_higher_education_alumniId_idx" ON "alumni_higher_education"("alumniId");

-- CreateIndex
CREATE INDEX "alumni_achievements_alumniId_idx" ON "alumni_achievements"("alumniId");

-- CreateIndex
CREATE INDEX "programs_degree_idx" ON "programs"("degree");

-- CreateIndex
CREATE INDEX "program_admission_requirements_programId_idx" ON "program_admission_requirements"("programId");

-- CreateIndex
CREATE INDEX "program_career_opportunities_programId_idx" ON "program_career_opportunities"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "courses_degree_semester_idx" ON "courses"("degree", "semester");

-- CreateIndex
CREATE INDEX "courses_type_idx" ON "courses"("type");

-- CreateIndex
CREATE INDEX "course_weekly_schedules_courseId_idx" ON "course_weekly_schedules"("courseId");

-- CreateIndex
CREATE INDEX "academic_resources_type_isPublished_idx" ON "academic_resources"("type", "isPublished");

-- CreateIndex
CREATE INDEX "academic_resources_targetDegree_academicYear_idx" ON "academic_resources"("targetDegree", "academicYear");

-- CreateIndex
CREATE INDEX "academic_resource_files_resourceId_idx" ON "academic_resource_files"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "laboratories_slug_key" ON "laboratories"("slug");

-- CreateIndex
CREATE INDEX "laboratories_isActive_sortOrder_idx" ON "laboratories"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "laboratory_equipment_labId_idx" ON "laboratory_equipment"("labId");

-- CreateIndex
CREATE INDEX "laboratory_images_labId_idx" ON "laboratory_images"("labId");

-- CreateIndex
CREATE INDEX "laboratory_schedules_labId_idx" ON "laboratory_schedules"("labId");

-- CreateIndex
CREATE INDEX "achievements_isPublished_achievedAt_idx" ON "achievements"("isPublished", "achievedAt");

-- CreateIndex
CREATE INDEX "achievements_isFeatured_isPublished_idx" ON "achievements"("isFeatured", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");

-- CreateIndex
CREATE INDEX "clubs_isActive_sortOrder_idx" ON "clubs"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "hero_slides_isActive_sortOrder_idx" ON "hero_slides"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_key_key" ON "statistics"("key");

-- CreateIndex
CREATE INDEX "statistics_isVisible_sortOrder_idx" ON "statistics"("isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- AddForeignKey
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_education" ADD CONSTRAINT "faculty_education_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_publications" ADD CONSTRAINT "faculty_publications_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_awards" ADD CONSTRAINT "faculty_awards_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_office_hours" ADD CONSTRAINT "faculty_office_hours_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_attachments" ADD CONSTRAINT "notice_attachments_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_schedule_items" ADD CONSTRAINT "event_schedule_items_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_media_items" ADD CONSTRAINT "gallery_media_items_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_group_projects" ADD CONSTRAINT "research_group_projects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "research_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_work_experience" ADD CONSTRAINT "alumni_work_experience_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_higher_education" ADD CONSTRAINT "alumni_higher_education_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_achievements" ADD CONSTRAINT "alumni_achievements_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_admission_requirements" ADD CONSTRAINT "program_admission_requirements_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_career_opportunities" ADD CONSTRAINT "program_career_opportunities_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_weekly_schedules" ADD CONSTRAINT "course_weekly_schedules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_resource_files" ADD CONSTRAINT "academic_resource_files_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "academic_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_equipment" ADD CONSTRAINT "laboratory_equipment_labId_fkey" FOREIGN KEY ("labId") REFERENCES "laboratories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_images" ADD CONSTRAINT "laboratory_images_labId_fkey" FOREIGN KEY ("labId") REFERENCES "laboratories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_schedules" ADD CONSTRAINT "laboratory_schedules_labId_fkey" FOREIGN KEY ("labId") REFERENCES "laboratories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
