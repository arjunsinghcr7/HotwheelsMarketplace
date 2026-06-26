import React, { useState } from 'react';

interface Reply {
  author: string;
  avatar: string;
  text: string;
  suggestedPrice?: number;
  helpful: number;
}

interface Thread {
  id: string;
  author: string;
  avatar: string;
  car: string;
  rarity: string;
  question: string;
  askedAgo: string;
  replies: Reply[];
}

const AV = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`;

const INITIAL_THREADS: Thread[] = [
  {
    id: 't1',
    author: 'DieCastDan',
    avatar: AV('dan'),
    car: "'67 Custom Mustang (STH)",
    rarity: 'Super Treasure Hunt',
    question: "Found a '67 Custom Mustang STH still on the card, serial #014/250. What's a fair asking price right now?",
    askedAgo: '12 min ago',
    replies: [
      { author: 'VaultKeeper', avatar: AV('vault'), text: 'Carded STH with a low serial is gold. Mint examples have been moving around $1.2k–$1.3k lately.', suggestedPrice: 1250, helpful: 24 },
      { author: 'RedlineRita', avatar: AV('rita'), text: 'Agreed. If the blister is crease-free you can hold out for the higher end.', suggestedPrice: 1300, helpful: 11 },
    ],
  },
  {
    id: 't2',
    author: 'GarageGail',
    avatar: AV('gail'),
    car: 'Nissan Skyline GT-R (Chase)',
    rarity: 'Chase',
    question: 'How much is a loose R34 Skyline chase in Bayside Blue worth? Mine has light wheel rub.',
    askedAgo: '38 min ago',
    replies: [
      { author: 'JDM_Collector', avatar: AV('jdm'), text: 'Loose with wheel rub I\'d price it ~$380–$420. Carded mint is closer to $450+.', suggestedPrice: 400, helpful: 17 },
    ],
  },
  {
    id: 't3',
    author: 'NewToTheHunt',
    avatar: AV('newbie'),
    car: 'Lamborghini Centenario (STH)',
    rarity: 'Super Treasure Hunt',
    question: 'Is $1,100 too much to pay for a gold-chrome Centenario STH? First big purchase, want a sanity check 🙏',
    askedAgo: '1 hr ago',
    replies: [
      { author: 'VaultKeeper', avatar: AV('vault'), text: 'That\'s market rate for a clean one. Not overpaying — just confirm the Spectraflame has no rub.', suggestedPrice: 1100, helpful: 31 },
      { author: 'ChaseChaser', avatar: AV('chase'), text: 'Welcome to the hobby! Fair price. Buy the condition, not just the car.', helpful: 9 },
    ],
  },
];

const rarityColor = (level: string) => {
  if (level === 'Super Treasure Hunt') return 'text-tertiary';
  if (level === 'Chase') return 'text-primary';
  if (level === 'Treasure Hunt') return 'text-secondary';
  return 'text-on-surface-variant';
};

export const CommunityBoard: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [car, setCar] = useState('');
  const [question, setQuestion] = useState('');

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!car.trim() || !question.trim()) return;
    const newThread: Thread = {
      id: `t_${Date.now()}`,
      author: 'You',
      avatar: AV('you'),
      car: car.trim(),
      rarity: 'Mainline',
      question: question.trim(),
      askedAgo: 'just now',
      replies: [],
    };
    setThreads([newThread, ...threads]);
    setCar('');
    setQuestion('');
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-sm lg:p-lg flex flex-col gap-lg">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">forum</span>
            Community Price Help
          </h2>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Collectors helping collectors figure out what their cars are really worth.
          </p>
        </div>
        <div className="flex gap-md">
          <div className="glass-panel px-md py-sm rounded-xl text-center">
            <p className="text-headline-md font-bold text-on-surface flex items-center gap-xs justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span>
              2,143
            </p>
            <p className="text-label-sm text-on-surface-variant">Collectors online</p>
          </div>
          <div className="glass-panel px-md py-sm rounded-xl text-center">
            <p className="text-headline-md font-bold text-tertiary">18.4k</p>
            <p className="text-label-sm text-on-surface-variant">Price checks given</p>
          </div>
        </div>
      </div>

      {/* Ask form */}
      <form onSubmit={handleAsk} className="glass-panel p-md rounded-xl flex flex-col gap-sm">
        <div className="flex items-center gap-sm mb-xs">
          <span className="material-symbols-outlined text-secondary">price_check</span>
          <h4 className="font-headline-md text-on-surface">Ask the community for a price check</h4>
        </div>
        <input
          value={car}
          onChange={(e) => setCar(e.target.value)}
          placeholder="Which car? e.g. '71 Datsun 510 wagon (TH)"
          className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/40"
        />
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Describe condition, packaging, serial #, and what you're hoping to buy or sell it for..."
          rows={2}
          className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm focus:ring-1 focus:ring-secondary outline-none text-body-md resize-none text-on-surface placeholder:text-on-surface-variant/40"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-lg py-sm racing-gradient text-white font-headline-md rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform flex items-center gap-sm"
          >
            <span className="material-symbols-outlined">send</span>
            Post Price Check
          </button>
        </div>
      </form>

      {/* Threads */}
      <div className="space-y-md">
        {threads.map((thread) => (
          <div key={thread.id} className="glass-panel p-md rounded-xl">
            {/* Question */}
            <div className="flex gap-sm">
              <img src={thread.avatar} alt={thread.author} className="w-10 h-10 rounded-full border border-outline-variant flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-xs flex-wrap">
                  <span className="text-label-md font-bold text-on-surface">{thread.author}</span>
                  <span className="text-[11px] text-on-surface-variant">· {thread.askedAgo}</span>
                  <span className={`text-[11px] font-bold uppercase ${rarityColor(thread.rarity)}`}>· {thread.car}</span>
                </div>
                <p className="text-body-md text-on-surface mt-1">{thread.question}</p>
              </div>
            </div>

            {/* Replies */}
            <div className="mt-md pl-2 sm:pl-12 space-y-sm">
              {thread.replies.length === 0 && (
                <p className="text-label-sm text-on-surface-variant italic">No replies yet — be the first to help!</p>
              )}
              {thread.replies.map((reply, i) => (
                <div key={i} className="flex gap-sm bg-surface-container rounded-lg p-sm border border-outline-variant">
                  <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-sm">
                      <span className="text-label-sm font-bold text-on-surface">{reply.author}</span>
                      {reply.suggestedPrice !== undefined && (
                        <span className="px-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-bold whitespace-nowrap">
                          Suggests ${reply.suggestedPrice.toLocaleString('en-US')}
                        </span>
                      )}
                    </div>
                    <p className="text-body-md text-on-surface-variant mt-1">{reply.text}</p>
                    <button className="mt-1 text-[11px] text-on-surface-variant hover:text-secondary flex items-center gap-xs transition-colors">
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      Helpful · {reply.helpful}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
