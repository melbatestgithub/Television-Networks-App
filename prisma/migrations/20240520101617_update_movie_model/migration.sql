-- Ensure this matches your database dialect (e.g., PostgreSQL, MySQL, SQLite)

-- Add new columns with default values
ALTER TABLE "Movies" ADD COLUMN "categoryId" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Movies" ADD COLUMN "channelId" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Movies" ADD COLUMN "typeId" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Movies" ADD COLUMN "videoUrl" TEXT NOT NULL DEFAULT '';

-- Change the type of the duration column
ALTER TABLE "Movies" ALTER COLUMN "duration" TYPE INTEGER USING "duration"::integer;

-- Remove the default values
ALTER TABLE "Movies" ALTER COLUMN "categoryId" DROP DEFAULT;
ALTER TABLE "Movies" ALTER COLUMN "channelId" DROP DEFAULT;
ALTER TABLE "Movies" ALTER COLUMN "typeId" DROP DEFAULT;
ALTER TABLE "Movies" ALTER COLUMN "videoUrl" DROP DEFAULT;
