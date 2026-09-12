import { estimateSpeechSeconds } from "@/lib/utils";

export const SEED_MEMORIES = [
  {
    title: "The letter I never sent",
    content:
      "I wrote it on the back of a receipt from the last meal we shared. I said I was sorry for leaving the room instead of staying in the argument. I said I still knew the way your laugh arrived before your face did. I folded it into my coat and walked past your building every evening for a week. On the seventh night the paper was soft from my pocket. I threw it in a bin near the station and told myself that silence was a kind of mercy. I still don't know who I was protecting.",
    category: "Love",
    emotion: "Sadness",
    year: 2019,
    location: "Manila",
    created: "2024-11-03T14:22:00Z",
  },
  {
    title: "I watched your train leave without waving",
    content:
      "You had the window seat. I could see the book you always pretended to read when you were nervous. I had a speech. It began with your name and ended with stay. The platform was loud in the way departures are loud — announcements, luggage, people pretending they are fine. I kept my hands in my coat. I thought if I didn't wave, the leaving would be less real. The train took you anyway. I stood there until the platform emptied and I was only a person with a sentence I had practiced in the shower.",
    category: "Goodbye",
    emotion: "Sadness",
    year: 2016,
    location: "Tokyo",
    created: "2025-02-18T02:11:00Z",
  },
  {
    title: "The phone call I rehearsed for three years",
    content:
      "Every version started the same: Hello, it's me. Then I would tell you I was tired of being the strong one. That I wanted you to ask how I was and wait for the real answer. I wrote the number on a sticky note and kept it in my wallet until the ink faded. On your birthday I dialed all but the last digit. I watched a dog cross the street in the rain. I put the phone down and ate rice standing at the counter. You called the next week about a cousin's wedding. I said I was fine. I have always been fine on the telephone.",
    category: "Family",
    emotion: "Fear",
    year: 2021,
    location: "Lagos",
    created: "2025-06-09T21:40:00Z",
  },
  {
    title: "I still owe you the truth about that night",
    content:
      "You asked if I was okay and I said yes because yes is a door that closes quietly. The truth is I had already decided to leave the city and I didn't want you to look at me like I was a person who could be convinced. I let you pay for the taxi. I let you think we had time. In the morning I sent a photograph of the skyline as if that were a goodbye. It wasn't. A goodbye would have used your name.",
    category: "Apology",
    emotion: "Sadness",
    year: 2014,
    location: "Chicago",
    created: "2024-08-21T03:05:00Z",
  },
  {
    title: "You were allowed to want more than this",
    content:
      "If I could reach the kitchen of our old apartment I would tell you to put the scholarship letter on the fridge instead of in the drawer. I would tell you that being needed is not the same as being loved. I would tell you the piano does not care that you are practical. Play the stupid song. Be embarrassing. The life you are building around other people's comfort will fit you like a borrowed coat — warm, wrong in the shoulders, difficult to take off in front of anyone.",
    category: "Younger Self",
    emotion: "Hope",
    year: 2020,
    location: null,
    created: "2025-01-12T16:08:00Z",
  },
  {
    title: "I hope you kept the piano",
    content:
      "I am writing to a person I have not become yet. If you are reading this, please tell me you still sit down on ordinary Tuesdays. Tell me you didn't sell it when the apartment got smaller. Tell me there is a scratch on the left leg from moving and you refused to repair it because it is proof that you chose the heavier thing. If there is no piano, I will understand. I only ask that you remember the sound of trying.",
    category: "Future Self",
    emotion: "Hope",
    year: 2023,
    location: "Vienna",
    created: "2025-09-02T01:44:00Z",
  },
  {
    title: "The job in Lisbon I was too afraid to take",
    content:
      "They offered a window that looked at terracotta and a salary that would have required courage. I said I needed a week. I used the week to make a spreadsheet of reasons to stay. The spreadsheet won because spreadsheets always win if you let them. I still look up the weather there when I can't sleep. I tell people I never wanted to live by the water. That is not true. I wanted to live by the water and I wanted someone to tell me it was not a childish wish.",
    category: "Lost Opportunities",
    emotion: "Nostalgia",
    year: 2018,
    location: "Lisbon",
    created: "2024-12-01T19:20:00Z",
  },
  {
    title: "We became strangers with the same jokes",
    content:
      "I saw your name on a group message and felt the old warmth, then the new distance. We used to finish each other's complaints. Now I don't know if you still take your coffee like a punishment. I typed a paragraph about a film we would have hated together. I deleted it because longing is unseemly after a certain age. I hope your kitchen is messy. I hope someone laughs at the thing only we used to notice.",
    category: "Friendship",
    emotion: "Nostalgia",
    year: 2017,
    location: "Melbourne",
    created: "2025-04-27T11:13:00Z",
  },
  {
    title: "I saw you in a grocery store and hid",
    content:
      "You were deciding between two kinds of rice. I remember that you always pretended not to care about brands and then cared. I stepped behind a pyramid of oranges like a person in a play. I could have said hello. Hello would have required a version of me that was ready to be seen. I bought nothing. I walked home in the cold with my hands smelling of citrus I didn't touch. Later I wondered if you had seen me and granted me the same mercy.",
    category: "Love",
    emotion: "Fear",
    year: 2022,
    location: "Brooklyn",
    created: "2025-03-14T02:52:00Z",
  },
  {
    title: "I chose the quieter life and called it wisdom",
    content:
      "There was a night I could have said yes to the tour, the cheap hotels, the uncertain money. I said I was being responsible. Responsibility looked like a fluorescent office and a lunch I ate too fast. I am not unhappy. That is the sentence I use. Sometimes in the evening a song from that year finds me on a bus and I have to hold the rail. The life I picked is a good coat. I only wish I had tried the other one on in the shop.",
    category: "Regret",
    emotion: "Sadness",
    year: 2011,
    location: "Seoul",
    created: "2024-10-08T08:33:00Z",
  },
  {
    title: "Dad, I found your letters in the attic",
    content:
      "They were not to us. They were to a person named L, written on graph paper, full of weather and apologies and a plan to learn French. I sat on the floorboards and read until the light went. I understood then that you had an interior I was never invited into, and that this was not a betrayal so much as a human fact. I put them back in the tin. I did not tell Mum. Some museums are private even inside a family.",
    category: "Family",
    emotion: "Healing",
    year: 2024,
    location: "Dublin",
    created: "2025-07-19T17:01:00Z",
  },
  {
    title: "I didn't go to the funeral",
    content:
      "I didn't know if I was still allowed to love you after the argument. I wore a dark shirt in my apartment and played the song you liked too loud. I thought grief required a ticket, a blood relation, a seat. I learned later that nobody is counting. I learned it too late to stand in the back of the room and be a person who showed up. I am sorry I confused pride with dignity.",
    category: "Goodbye",
    emotion: "Sadness",
    year: 2015,
    location: "Cairo",
    created: "2025-05-02T03:18:00Z",
  },
  {
    title: "I left the porch light on for a year",
    content:
      "Not because I believed you were coming. Because the house looked less abandoned that way. The neighbors thought I was careful. I was staging a welcome I could not speak. When the bulb finally died I stood on the step in the dark and felt something finish. I did not replace it. That was the first honest thing I did in months.",
    category: "Love",
    emotion: "Hope",
    year: 2019,
    location: "Portland",
    created: "2024-09-30T01:09:00Z",
  },
  {
    title: "The summer we almost moved to the coast",
    content:
      "We had a box labeled KITCHEN and a map with a circle around a town whose name we liked saying. Then your mother got sick and the circle became a pause and the pause became a life. We still have the box in the spare room. Sometimes I open it and the smell of old newspaper comes out like a weather system. We were not wrong to stay. We were not wrong to want the water. Both things can sit on the same shelf.",
    category: "Lost Opportunities",
    emotion: "Nostalgia",
    year: 2009,
    location: "Barcelona",
    created: "2025-08-11T12:47:00Z",
  },
  {
    title: "I needed you to fight for us once",
    content:
      "You were so skilled at being reasonable. You folded the relationship into neat points and called it communication. I wanted someone to be a little bit foolish. To miss a train. To say don't go. You wished me luck with a kindness that felt like a form letter. I have since learned that calm is not always love. Sometimes it is an exit dressed as maturity.",
    category: "Love",
    emotion: "Anger",
    year: 2020,
    location: "London",
    created: "2025-01-29T22:15:00Z",
  },
  {
    title: "I forgave you in a parked car",
    content:
      "The rain made the windscreen private. I said your name the way I used to, without armor. I did not call you. Forgiveness did not require an audience. I sat until the windows fogged and I could no longer see the street. When I started the engine I felt lighter and also a little betrayed by my own peace. Healing is not cinematic. It is a person in a car deciding to stop rehearsing the injury.",
    category: "Apology",
    emotion: "Healing",
    year: 2023,
    location: "Toronto",
    created: "2024-07-04T04:22:00Z",
  },
  {
    title: "I almost told my mother I was unhappy",
    content:
      "She was cutting fruit. The knife made a steady sound that felt like permission. I had the sentence ready: I don't think this is my life. A neighbor knocked about sugar. By the time the door closed the kitchen had returned to being a kitchen. I ate the fruit. It was sweet. I said thank you, which was true and also a substitute for the other true thing.",
    category: "Family",
    emotion: "Fear",
    year: 2018,
    location: "Mumbai",
    created: "2025-02-07T18:55:00Z",
  },
  {
    title: "The text that starts I know it's been years",
    content:
      "I drafted it seventeen times. I know it's been years. I saw a bicycle like yours. I am not asking to return. I am asking if you remember the night the power went out and we counted the floors by the candles in other windows. I never pressed send because I couldn't bear a blue tick or the absence of one. Some messages are complete without a recipient. They are how we tell ourselves we were real.",
    category: "Love",
    emotion: "Nostalgia",
    year: 2025,
    location: "Paris",
    created: "2026-01-03T01:27:00Z",
  },
  {
    title: "I had the tickets. I didn't board.",
    content:
      "I stood at the gate with a bag that was too small for a new life and too large for a weekend. My name was called. The woman at the desk looked at me with professional kindness. I said I had forgotten something. What I had forgotten was bravery. I took the train back to a house that smelled like my decisions. The unused ticket lived in a book for a year. I used it as a bookmark for a novel about leaving. I did not find this funny at the time.",
    category: "Lost Opportunities",
    emotion: "Fear",
    year: 2016,
    location: "New York",
    created: "2024-11-19T03:41:00Z",
  },
  {
    title: "Stop apologizing for taking up space",
    content:
      "You say sorry when someone bumps you. You say sorry before you speak. You shrink in photographs. I need you to know that the room does not become larger because you occupy less of it. Be a little inconvenient. Order the thing you want. Take the window. The people who love you are not keeping a ledger of your volume. The ones who are should not be allowed to design your posture.",
    category: "Younger Self",
    emotion: "Hope",
    year: 2022,
    location: "São Paulo",
    created: "2025-10-16T09:12:00Z",
  },
  {
    title: "I still save you a seat",
    content:
      "At the cinema I buy two tickets out of muscle memory and then donate the extra to a stranger in a way that looks generous and is actually grief with good manners. I hope you are loud somewhere. I hope you still talk through the trailers. If you ever wonder whether you were missed, the answer is a dark room with an empty chair that I pretend is a preference.",
    category: "Friendship",
    emotion: "Sadness",
    year: 2021,
    location: "Berlin",
    created: "2025-12-02T02:08:00Z",
  },
  {
    title: "You asked me to wait. I did.",
    content:
      "You said after the exam, after the move, after your father got better. I became a professional at after. I learned the shape of a pause that pretends to be a plan. When you wrote that you had met someone who made after unnecessary, I congratulated you because I had practiced being good. I was not good. I was a person who had paused their life like a song and come back to find the room rearranged.",
    category: "Goodbye",
    emotion: "Anger",
    year: 2013,
    location: "Istanbul",
    created: "2024-06-22T15:36:00Z",
  },
  {
    title: "I wanted a sibling so I wouldn't be the only witness",
    content:
      "Growing up in a quiet house means you become the archive. You remember what was said in the car, the way the door sounded when it was slammed with care. I wanted someone else who could confirm the weather of those years. I have friends now who believe me. It helps. It is not the same as a person who was there, eating the same breakfast, learning the same silences.",
    category: "Family",
    emotion: "Sadness",
    year: 2008,
    location: "Cape Town",
    created: "2025-03-30T20:04:00Z",
  },
  {
    title: "The almost-kiss in the library stairwell",
    content:
      "We were talking about a poet neither of us had finished. The stairwell smelled like dust and raincoats. You looked at my mouth and then at the fire extinguisher as if it might offer protocol. Someone laughed two floors up. The moment closed like a book that was never checked out. I still cannot read that poet without feeling the specific temperature of almost.",
    category: "Love",
    emotion: "Nostalgia",
    year: 2012,
    location: "Boston",
    created: "2024-05-17T01:58:00Z",
  },
  {
    title: "I used work as a hiding place",
    content:
      "They gave me awards for the hours I was using to not go home to myself. I called it ambition. Ambition is a flattering name for fear that has a calendar invite. I am trying, now, to leave the office while there is still light. It feels like truancy. It feels like the beginning of a life I postponed in fifteen-minute increments.",
    category: "Regret",
    emotion: "Healing",
    year: 2024,
    location: "Singapore",
    created: "2026-02-11T13:29:00Z",
  },
  {
    title: "Leaving was also love",
    content:
      "I used to think love meant remaining until the shape of me disappeared. I packed in the daylight so it wouldn't feel like an escape. I left your favorite mug. I left a note that only said thank you, which was incomplete and also the only true sentence I trusted myself to write. If you hated me for a while, I understand. I was learning that staying can be a kind of vanishing.",
    category: "Goodbye",
    emotion: "Healing",
    year: 2025,
    location: "Mexico City",
    created: "2026-04-08T03:33:00Z",
  },
  {
    title: "Somewhere you are happy. I decided that today.",
    content:
      "I cannot verify it. I have no photographs. I have chosen it the way one chooses to believe a city still exists after the plane has lifted. You are at a table. Someone has just said your name correctly. The light is ordinary and sufficient. I put this on the shelf next to the other things I cannot prove: that I was kind enough, that I was missed, that the almosts were not wasted. Belief is a small museum of its own.",
    category: "Future Self",
    emotion: "Hope",
    year: 2026,
    location: null,
    created: "2026-08-20T00:47:00Z",
  },
  {
    title: "I wrote our names on a receipt and kept it",
    content:
      "It was for two teas and a cake we split badly. I wrote the names the way children do, with a plus sign, as if arithmetic could hold a feeling. It lived in a copy of a novel I never finished. When I moved I found it and smiled like a person looking at a fossil. I did not throw it away. I am not superstitious. I am only unwilling to discard evidence that I was briefly brave on paper.",
    category: "Love",
    emotion: "Love",
    year: 2010,
    location: "Taipei",
    created: "2024-04-12T10:16:00Z",
  },
  {
    title: "The apology I saved for a better moment",
    content:
      "I waited for a birthday, then a quiet week, then a time when I would be a more impressive person offering a more impressive sorry. The better moment did not arrive. It never does. Sorry is not a performance that requires lighting. I am leaving this here because you may never hear it, and because the archive is a place where late things can still be true.",
    category: "Apology",
    emotion: "Sadness",
    year: 2017,
    location: "Hong Kong",
    created: "2025-11-09T02:21:00Z",
  },
  {
    title: "I wanted to be from somewhere on purpose",
    content:
      "Every city I lived in felt like a draft. I learned just enough of the transit system to pretend I belonged and not enough of the language to dream. I thought a real life would announce itself with a lease and a set of keys that didn't feel temporary. If you are still moving, I hope you notice the morning you stop comparing the light to somewhere else. That is the closest thing I have to arrival.",
    category: "Lost Opportunities",
    emotion: "Nostalgia",
    year: 2019,
    location: "Vancouver",
    created: "2026-03-01T07:05:00Z",
  },
] as const;

export const SEED_LIVES = [
  {
    title: "The life I almost lived in Lisbon",
    category: "Almost Place",
    age: 29,
    location: "Lisbon",
    career: "Translator of quiet novels",
    relationship: "Someone who arrives home with bread",
    dream: "A window that looks at water I cannot afford to romanticize",
    story:
      "In this life I take the job. I learn the trams by the sound of their bells. I am not famous. I am merely a person who unpacks. On Sundays I walk until the city becomes ocean. I still miss the other life — the practical one — but I miss it the way you miss a coat in spring: politely, without returning to the closet.",
  },
  {
    title: "I became a musician instead of choosing stability",
    category: "Almost Career",
    age: 34,
    location: "Vienna",
    career: "Session pianist, teacher of impatient teenagers",
    relationship: "Married to a sound engineer who hates my hours and loves my hands",
    dream: "One record that a stranger plays in a kitchen",
    story:
      "The money is irregular. The apartment is full of scores and unpaid bills that I treat as weather. I play weddings and I play my own songs at 1 a.m. when the building will tolerate it. I am not happier in a simple way. I am more correctly tired. When people ask if I regret the office, I tell them I regret nothing except the years I spent calling this a hobby as if that would keep it from mattering.",
  },
  {
    title: "The version of me who stayed",
    category: "Almost Love",
    age: 41,
    location: "London",
    career: "Same job, softer edges",
    relationship: "Still with the person I left at the station",
    dream: "An ordinary argument about nothing that ends in the same bed",
    story:
      "We have a garden that is not impressive. We know each other's pharmacies. I never became mysterious. I became known. There are days I walk past the station and feel a ghost of the leaving I did not do. In this life the ghost is smaller. We have not solved anything. We have simply continued, which is its own art.",
  },
  {
    title: "A father in a city that is not this one",
    category: "Almost Family",
    age: 38,
    location: "Toronto",
    career: "High school history teacher",
    relationship: "Co-parenting with someone kind I did not marry in the other life",
    dream: "A child who knows I will come to the play",
    story:
      "I leave work on time. This is the miracle. There is a lunchbox with a note that is embarrassing and necessary. I am afraid every day and I do it anyway. The apartment is louder than I thought I wanted. In the other life I am praised for being free. In this one I am tired in a way that feels like belonging.",
  },
  {
    title: "The woman who told her mother in the kitchen",
    category: "Almost Self",
    age: 27,
    location: "Mumbai",
    career: "Designer who stopped asking permission",
    relationship: "None required for the sentence to be complete",
    dream: "A house where the truth can sit on the table with the fruit",
    story:
      "She puts down the knife. She listens. She does not understand and she does not leave the room. Later there is a difficult month. Later there is tea. I am not free of fear. I am free of the particular lie that kept the kitchen bright and false. I walk differently after that afternoon, as if the street had been widened.",
  },
  {
    title: "I opened the small restaurant",
    category: "Almost Career",
    age: 45,
    location: "Mexico City",
    career: "Cook, owner, washer of the last pan",
    relationship: "A partner who closes with me and complains about my basil",
    dream: "A regular who does not need the menu",
    story:
      "It seats twenty-two. The sign is too modest. I burn things and I get better. People come for the soup and stay because the room feels like someone decided to care. I do not become a brand. I become a place. On Tuesdays it rains and we still open. That is the whole philosophy.",
  },
  {
    title: "The almost-move to the coast",
    category: "Almost Place",
    age: 33,
    location: "Barcelona",
    career: "Same work, salt on the windows",
    relationship: "The person who circled the town on the map",
    dream: "A kitchen that smells like the sea even when we are arguing",
    story:
      "We unpack the box labeled KITCHEN. The mother gets better, or at least better enough. We live in the circled town and it is not a postcard. The water is cold. The rent is unkind. We are still ourselves. But at night the windows go pale with moon and I remember that some lives are just a box you actually open.",
  },
  {
    title: "I did not hide in the grocery store",
    category: "Almost Love",
    age: 36,
    location: "Brooklyn",
    career: "Unchanged",
    relationship: "A conversation in aisle four that becomes coffee",
    dream: "To be seen without a pyramid of oranges for cover",
    story:
      "I say your name. You look up from the rice. It is awkward and then it is not. We do not restart the old life. We invent a smaller one: walks, honesty, fewer speeches. Sometimes almost becomes a door instead of a wall. This is that door, held open by a person who decided hiding was a habit, not a fate.",
  },
] as const;

export const SEED_CAPSULES = [
  {
    title: "For the stranger who is tired",
    content:
      "If you are reading this, you lasted. That is not a small thing. Eat something warm. Put your phone in another room for ten minutes. The world will not collapse because you were gentle with yourself. I am a person you will never meet, and I am on your side in a quiet way.",
    unlockAt: "2025-01-01T00:00:00Z",
    privacy: "public" as const,
    recipient: "Stranger",
  },
  {
    title: "To the one who takes the job",
    content:
      "Pack the good shoes. Learn two phrases before you land. Call someone on the third night when the excitement thins. You are allowed to be happy without a spreadsheet's permission.",
    unlockAt: "2027-06-01T00:00:00Z",
    privacy: "public" as const,
    recipient: "Future self",
  },
  {
    title: "A note for a later winter",
    content:
      "You will think you have not changed. Look at your hands. Look at the way you make tea now. Change is rarely a parade. It is a sequence of quieter rooms.",
    unlockAt: "2026-12-21T00:00:00Z",
    privacy: "public" as const,
    recipient: "Future self",
  },
  {
    title: "If I do not say this at dinner",
    content:
      "I am proud of you in a way that does not fit beside the potatoes. I see how hard you work at being easy. You can rest. You can be a little difficult. You are not a guest in your own family.",
    unlockAt: "2028-03-15T00:00:00Z",
    privacy: "public" as const,
    recipient: "Family",
  },
  {
    title: "Keep the porch light honest",
    content:
      "Do not leave it on for ghosts. Leave it on because you live there. That is enough reason for a house to look awake.",
    unlockAt: "2024-06-01T00:00:00Z",
    privacy: "public" as const,
    recipient: "Someone specific",
  },
];

export const SEED_VOICES = [
  {
    title: "A confession to an empty kitchen",
    category: "Confessions",
    transcript:
      "I liked who I was when you were leaving. I liked the drama of being almost-left. It made me feel chosen even as I was not. I am trying to like who I am when nobody is walking away.",
  },
  {
    title: "Last words I did not get to say",
    category: "Last Words",
    transcript:
      "Thank you for the sandwiches. Thank you for waiting in cars. Thank you for pretending my drawings were good. I wish I had been less busy. I wish I had sat on the edge of your bed and done nothing together.",
  },
  {
    title: "Memory of a bus at dusk",
    category: "Memories",
    transcript:
      "The windows were dirty in a holy way. You fell asleep on my shoulder and I did not move even when my arm went numb. I thought: this is a life. I did not know it was a peak. I thought there would be a thousand buses.",
  },
  {
    title: "A dream I keep having",
    category: "Dreams",
    transcript:
      "I am in a house with many doors. Behind one of them is the version of me that stayed. She is not happier. She is just there, folding laundry, and she looks up as if I am late.",
  },
  {
    title: "Letter I would have read aloud",
    category: "Letters",
    transcript:
      "I am not asking you to come back. I am asking you to believe that what we had was a real climate, not a weather event. I carry it without needing it to resume. That is as close as I can get to blessing you.",
  },
  {
    title: "For anyone still in the stairwell",
    category: "Confessions",
    transcript:
      "If you are waiting for a sign that you can say the thing, this is a poor sign and also the only one I can offer. Say it badly. Say it once. The fire extinguisher will not mind.",
  },
].map((voice) => ({
  ...voice,
  durationSec: estimateSpeechSeconds(voice.transcript),
}));

export const SEED_BOOKS = [
  {
    title: "The person who almost became a witness",
    chapterBefore:
      "I grew up as an only child in a house that treated feelings like guests who had arrived too early. I learned to be useful. I learned the names of silences.",
    chapterMoment:
      "In a kitchen in another country I watched a family argue and then eat anyway. Nobody left the table. I understood, with a shock that felt like jealousy, that conflict could be a form of staying.",
    chapterChange:
      "I began to tell small truths. I stopped translating my days into a performance of fine. Friends learned the actual weather of me.",
    chapterAfter:
      "I am still an archive. I am also a person who can be read in real time. The book is unfinished, which I have decided is the point.",
  },
  {
    title: "A study in porches",
    chapterBefore:
      "I believed love was a light you left on so someone could find the door.",
    chapterMoment:
      "The bulb died and the house did not. I stood in the dark and realized I had been keeping a shrine to a person who had already arrived somewhere else.",
    chapterChange:
      "I bought a weaker bulb. I used it for reading. The porch became a porch again.",
    chapterAfter:
      "I still like evening. I no longer confuse illumination with waiting.",
  },
  {
    title: "Notes from the unsent decade",
    chapterBefore:
      "I wrote constantly to people who would never receive the writing. My pockets were full of paper.",
    chapterMoment:
      "A friend asked me what I was carrying and I had no answer that was not a letter.",
    chapterChange:
      "I started leaving the letters here, among strangers, which is a kind of sending that does not demand a reply.",
    chapterAfter:
      "The pockets are lighter. The sentences still arrive. They have a museum now, which is a ridiculous and perfect fate.",
  },
  {
    title: "The quieter ambition",
    chapterBefore:
      "I collected hours the way other people collect stamps. I was admired. I was unavailable to myself.",
    chapterMoment:
      "A doctor said the word rest as if it were a country I had never visited.",
    chapterChange:
      "I left while there was still light. I cooked badly. I called it practice.",
    chapterAfter:
      "The awards stopped. A life started, modest as a plant on a windowsill that I actually water.",
  },
];

export const SEED_WALL = [
  {
    content: "I miss my father in the grocery store more than in the obvious places.",
    emotion: "Sadness",
    replies: ["I understand.", "The ordinary aisles are the hardest rooms."],
  },
  {
    content: "I left a city and nobody threw a party. I needed someone to mark it.",
    emotion: "Nostalgia",
    replies: ["Leaving can be a ceremony even if you hold it alone."],
  },
  {
    content: "I am afraid that kindness is the only interesting thing I can do.",
    emotion: "Fear",
    replies: ["Kindness is not a small talent.", "I understand."],
  },
  {
    content: "If you are reading this after midnight, I am awake too.",
    emotion: "Hope",
    replies: ["The museum is open. Sit as long as you need."],
  },
  {
    content: "I almost asked her to stay. The sentence is still in my mouth.",
    emotion: "Love",
    replies: ["Some sentences keep their shape for years. That is allowed."],
  },
  {
    content: "Worked late again. Called it love. It wasn't.",
    emotion: "Healing",
    replies: ["I understand.", "You can put the hours down."],
  },
  {
    content: "Does anyone else save seats for people who are not coming?",
    emotion: "Sadness",
    replies: ["Yes.", "The empty chair is a kind of altar. You can also let it be a chair."],
  },
  {
    content: "Today I forgave someone without telling them. It still counted.",
    emotion: "Healing",
    replies: ["It counted."],
  },
  {
    content: "I want a life that is quieter and I am ashamed of wanting it.",
    emotion: "Hope",
    replies: ["Quiet is not a failure of ambition."],
  },
  {
    content: "To the person I hid from among the oranges: I hope the rice turned out.",
    emotion: "Love",
    replies: ["I understand."],
  },
];
