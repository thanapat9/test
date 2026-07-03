export const QUOTES = [
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "A year from now you'll wish you had started today.", author: "Karen Lamb" },
  { text: "Fall in love with the process and the results will come.", author: "Eric Thomas" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Data is the new oil, but it's useless if you don't refine it.", author: "Clive Humby" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "It's not about having time. It's about making time.", author: "Unknown" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The pain of discipline is far less than the pain of regret.", author: "Sarah Bombell" },
  { text: "Your future self is watching you right now through your memories.", author: "Aubrey de Grey" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { text: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "Consistency is more important than intensity.", author: "Unknown" },
  { text: "You are one decision away from a completely different life.", author: "Unknown" },
  { text: "Today's actions are tomorrow's results.", author: "Unknown" },
  { text: "Without data, you're just another person with an opinion.", author: "W. Edwards Deming" },
  { text: "The more you learn, the more you earn.", author: "Warren Buffett" },
  { text: "Kaizen: continuous improvement, every single day.", author: "Unknown" },
]

export function getDailyQuote() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = new Date() - start
  const dayOfYear = Math.floor(diff / 86400000)
  return QUOTES[dayOfYear % QUOTES.length]
}
