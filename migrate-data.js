import { createClient } from '@supabase/supabase-js';

// Old database connection - using service role key for full access
const oldSupabaseServiceKey = process.env.OLD_SUPABASE_SERVICE_KEY || 'MISSING_SERVICE_KEY';
const oldSupabase = createClient(
  'https://dswoqywpdyzjofngyisc.supabase.co',
  oldSupabaseServiceKey
);

// New database connection
const newSupabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function migrateData() {
  try {
    console.log('Starting data migration...\n');

    // 1. Migrate employees
    console.log('Fetching employees from old database...');
    const { data: oldEmployees, error: employeesError } = await oldSupabase
      .from('employees')
      .select('*');

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
    } else if (oldEmployees && oldEmployees.length > 0) {
      console.log(`Found ${oldEmployees.length} employees`);

      for (const employee of oldEmployees) {
        const { error: insertError } = await newSupabase
          .from('employees')
          .upsert(employee, { onConflict: 'email' });

        if (insertError) {
          console.error(`Error inserting employee ${employee.email}:`, insertError.message);
        } else {
          console.log(`✓ Migrated employee: ${employee.name}`);
        }
      }
    } else {
      console.log('No employees found in old database');
    }

    // 2. Migrate case studies
    console.log('\nFetching case studies from old database...');
    const { data: oldCaseStudies, error: caseStudiesError } = await oldSupabase
      .from('case_studies')
      .select('*');

    if (caseStudiesError) {
      console.error('Error fetching case studies:', caseStudiesError);
    } else if (oldCaseStudies && oldCaseStudies.length > 0) {
      console.log(`Found ${oldCaseStudies.length} case studies`);

      for (const caseStudy of oldCaseStudies) {
        const { error: insertError } = await newSupabase
          .from('case_studies')
          .upsert(caseStudy);

        if (insertError) {
          console.error(`Error inserting case study ${caseStudy.title}:`, insertError.message);
        } else {
          console.log(`✓ Migrated case study: ${caseStudy.title}`);
        }
      }
    } else {
      console.log('No case studies found in old database');
    }

    // 3. Check for profiles
    console.log('\nChecking for profiles...');
    const { data: oldProfiles, error: profilesError } = await oldSupabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.log('Profiles table not accessible or does not exist');
    } else if (oldProfiles && oldProfiles.length > 0) {
      console.log(`Found ${oldProfiles.length} profiles`);
      console.log('Note: User profiles are tied to auth.users and cannot be directly migrated');
      console.log('Admin users will need to be recreated manually');
    }

    // 4. Check for contact requests or other tables
    console.log('\nChecking for contact_requests...');
    const { data: oldRequests, error: requestsError } = await oldSupabase
      .from('contact_requests')
      .select('*');

    if (requestsError) {
      console.log('No contact_requests table found (this is normal if not implemented yet)');
    } else if (oldRequests && oldRequests.length > 0) {
      console.log(`Found ${oldRequests.length} contact requests`);
      console.log('Note: contact_requests table needs to be created in new database first');
    }

    console.log('\n✅ Data migration completed!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
