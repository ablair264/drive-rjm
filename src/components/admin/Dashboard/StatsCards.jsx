import { Inbox, CalendarClock, ClipboardCheck } from 'lucide-react';

export default function StatsCards({
  enquiriesCount,
  lessonsThisWeek,
  newLearners,
  upcomingTests,
  nextTestLabel
}) {
  const cards = [
    {
      title: 'Open Enquiries',
      value: enquiriesCount.toString(),
      sub: 'Live submissions awaiting reply',
      Icon: Inbox
    },
    {
      title: 'Lessons This Week',
      value: lessonsThisWeek.toString(),
      sub: `${newLearners} new learners`,
      Icon: CalendarClock
    },
    {
      title: 'Upcoming Tests',
      value: upcomingTests.toString(),
      sub: nextTestLabel ? `Next: ${nextTestLabel}` : 'No tests booked',
      Icon: ClipboardCheck
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const IconComponent = card.Icon;
        return (
          <div
            key={card.title}
            className="bg-white border-l-4 border-learner-red rounded-xl shadow-sm p-5 flex items-center gap-4"
          >
            <div className="h-12 w-12 bg-learner-red text-white rounded-full flex items-center justify-center shadow-md">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-medium-grey font-semibold uppercase tracking-wide">
                {card.title}
              </div>
              <div className="text-2xl font-display font-bold text-dark">{card.value}</div>
              <div className="text-sm text-medium-grey">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
