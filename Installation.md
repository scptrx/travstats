## Stack
- Node.js
- Express.js
- Supabase
- JWT based authentication via Supabase (Supabase Auth)
- Multer (file uploads)
- Winston (logging)

## Project Structure
```
backend/
 ┣ src/
 ┃ ┣ controllers/     # Request handling logic
 ┃ ┣ models/          # Database and business logic
 ┃ ┣ routes/          # API routes
 ┃ ┣ middlewares/     # Auth, validation, logging
 ┃ ┣ utils/logger.js  # Logger
 ┃ ┣ supabase.js      # Supabase client configuration
 ┃ ┗ server.js        # App entry point
 ┣ package.json
 ┗ .env
```
## Requirements
Before installation, make sure you have:
- Node.js v18 or newer
- npm
- A Supabase project

## Installation
### Clone the repository
```bash
git clone https://github.com/scptrx/travstats.git
cd travstats/backend
```
### Install dependencies
```bash
npm install
```
### Environment variables
Create a `.env` file inside `backend/src/` with the following content:
```env
NODE_ENV=development
SUPABASE_URL=
SUPABASE_ANON_PUBLIC_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_API_KEY=
PORT=
```
- `SUPABASE_URL`  
    Your Supabase project URL
- `SUPABASE_ANON_PUBLIC_KEY`  
    Public anon key from Supabase settings
- `SUPABASE_SERVICE_ROLE_KEY`  
    Service role key, used for admin operations
- `GOOGLE_API_KEY`  
    Google API key, used for geocoding
- `PORT`  
    Server port

## Database Schema
### `profiles`
- `id` uuid, **PK**, **FK → auth.users.id**
- `username` text, UNIQUE
- `email` text, UNIQUE
- `profile_picture_url` text
- `role` text
- `restricted_until` date
- `created_at` timestamptz

### `countries`
- `id` integer, **PK**
- `iso_code` text, UNIQUE
- `name` text
- `region` text
- `latitude` double precision
- `longitude` double precision
- `created_at` timestamptz

### `subdivisions`
- `id` integer, **PK**
- `country_id` integer, **FK → countries.id**
- `name` text
- `code` text
- `type` text
- `latitude` double precision
- `longitude` double precision
- `created_at` timestamptz

### `cities`
- `id` integer, **PK**
- `country_id` integer, **FK → countries.id**    
- `subdivision_id` integer, **FK → subdivisions.id**
- `name` text
- `latitude` double precision
- `longitude` double precision
- `created_at` timestamptz

### `visits`
- `id` bigint, **PK**
- `user_id` uuid, **FK → profiles.id**
- `country_id` integer, **FK → countries.id**
- `subdivision_id` integer, **FK → subdivisions.id**
- `city_id` integer, **FK → cities.id**
- `visit_date` date
- `notes` text
- `created_at` timestamptz
- `updated_at` timestamptz

## Database Triggers and Functions
### Profile auto creation trigger
```sql
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND OLD.email_confirmed_at IS NULL
     AND NOT EXISTS (
       SELECT 1 FROM public.profiles WHERE id = NEW.id
     ) THEN
    INSERT INTO public.profiles (id, username, email, profile_picture_url)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
      ),
      NEW.email,
      NULL
    );
  END IF;

  RETURN NEW;
END;
```
### Visits cascade delete trigger
```sql
DECLARE
  is_running boolean;
BEGIN
  BEGIN
    SELECT value::boolean
    INTO is_running
    FROM pg_temp.trigger_flags
    WHERE key = 'country_trigger_running';
  EXCEPTION
    WHEN undefined_table THEN
      CREATE TEMP TABLE pg_temp.trigger_flags (
        key text PRIMARY KEY,
        value text
      ) ON COMMIT DROP;

      INSERT INTO pg_temp.trigger_flags
      VALUES ('country_trigger_running', 'false');

      is_running := false;
  END;

  IF is_running THEN
    RETURN OLD;
  END IF;

  IF OLD.country_id IS NOT NULL
     AND OLD.subdivision_id IS NULL
     AND OLD.city_id IS NULL THEN

    UPDATE pg_temp.trigger_flags
    SET value = 'true'
    WHERE key = 'country_trigger_running';

    DELETE FROM visits
    WHERE country_id = OLD.country_id
      AND id <> OLD.id;

    UPDATE pg_temp.trigger_flags
    SET value = 'false'
    WHERE key = 'country_trigger_running';
  END IF;

  RETURN OLD;
END;
```
## Running the server
### Development mode
```bash
npm run dev
```
### Production mode
```bash
npm start
```
