import type { CalendarItem } from "../../utils/types";
import { getAwardAnniversariesForYear } from "../../lib/dateUtils";

interface AwardData {
  id: string;
  title: string;
  date: string;
  type: 'function';
  description: string;
}

const awardsData: AwardData[] = [
  {
    id: "award-2012-02-26",
    title: "Stardust Awards - Best Actress",
    date: "2012-02-26",
    type: "function",
    description: "Won Best Actress for 'Aashiqui 2' at The Stardust Awards 2012"
  },
  {
    id: "award-2013-12-18",
    title: "Big Star Entertainment Awards - Best Romantic Couple",
    date: "2013-12-18",
    type: "function",
    description: "Won Best Romantic Couple for 'Aashiqui 2' at The Big Star Entertainment Awards 2013"
  },
  {
    id: "award-2013-11-23",
    title: "Hello! Hall of Fame - Fresh Face of the Year",
    date: "2013-11-23",
    type: "function",
    description: "Won Fresh Face of the Year for 'Aashiqui 2' at Hello! Hall of Fame Awards 2013"
  },
  {
    id: "award-2014-01-14",
    title: "20th Screen Awards - Jodi No 1",
    date: "2014-01-14",
    type: "function",
    description: "Won Jodi No 1 for 'Aashiqui 2' at 20th Screen Awards 2014"
  },
  {
    id: "award-2014-01-16",
    title: "9th Star Guild Awards - Jodi Of The Year",
    date: "2014-01-16",
    type: "function",
    description: "Won Jodi Of The Year for 'Aashiqui 2' at 9th Star Guild Awards 2014"
  },
  {
    id: "award-2015-01-11",
    title: "Star Guild Awards - Shining Superstar",
    date: "2015-01-11",
    type: "function",
    description: "Honored with Shining Superstar award at Star Guild Awards 2015"
  },
  {
    id: "award-2015-02-24",
    title: "GiMA Awards - Best Celebrity Singer of the Year",
    date: "2015-02-24",
    type: "function",
    description: "Won Best Celebrity Singer of the Year for 'Ek Villain' at Global Indian Music Academy Awards 2015"
  },
  {
    id: "award-2022-09-28",
    title: "Lokmat Stylish Awards - Power Icon",
    date: "2022-09-28",
    type: "function",
    description: "Honored with Power Icon award at Lokmat Stylish Awards 2022"
  },
  {
    id: "award-2019-03-23",
    title: "Nickelodeon Kids' Choice Awards - Favorite Movie Actress",
    date: "2019-03-23",
    type: "function",
    description: "Won Favorite Movie Actress for 'Chhichhore' at Nickelodeon Kids' Choice Awards 2019"
  },
  {
    id: "award-2024-03-18",
    title: "Pinkvilla Screen & Style Icons Awards - Most Stylish Fan Favourite Superstar",
    date: "2024-03-18",
    type: "function",
    description: "Honored with Most Stylish Fan Favourite Superstar at Pinkvilla Screen & Style Icons Awards 2024"
  },
  {
    id: "award-2024-02-01",
    title: "Iconic Gold Awards - Best Actress of the Year",
    date: "2024-02-01",
    type: "function",
    description: "Won Best Actress of the Year for 'Tu Jhoothi Main Makkaar' at The Iconic Gold Awards 2024"
  },
  {
    id: "award-2025-02-23",
    title: "Zee Cine Awards - Best Actor-Female",
    date: "2025-02-23",
    type: "function",
    description: "Won Best Actor-Female for 'Stree 2' at Zee Cine Awards 2025"
  }
];

export const getAwardsForYear = (year: number): CalendarItem[] => {
  return getAwardAnniversariesForYear(awardsData, year);
};

// For backward compatibility, export awards for the current year
const currentYear = new Date().getFullYear();
export const awards = getAwardsForYear(currentYear);
