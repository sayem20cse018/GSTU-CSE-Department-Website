import { redirect } from 'next/navigation';

// /students/clubs → /clubs (dept clubs listing)
export default function StudentClubsPage() {
  redirect('/clubs');
}
