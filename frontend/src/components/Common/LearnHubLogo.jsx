import { BookOpen } from 'lucide-react';

const LearnHubLogo = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <BookOpen className="w-7 h-7 text-[#A0C878]" />
    <span className="text-2xl font-bold">
      <span className="text-[#A0C878]">Learn</span>
      <span className="text-[#2E4057]">Hub</span>
    </span>
  </div>
);

export default LearnHubLogo;