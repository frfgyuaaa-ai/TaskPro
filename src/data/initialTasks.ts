import { Task, UserProfile } from '../types/task';

export const TASKPRO_LOGO = 'https://lh3.googleusercontent.com/aida/AEtjO1V5cRPPSx_xMOLV_tvS2PnGAqyE9gKOcgZxJBN3R5t5o0xphxZPZuuUaqy95F008Alfa91hUhf3L6e0nvDrIBM675_SpKcw9mSnjtzSa_doYKFm1S0iIonoTTM2QBXYsxmYCBmRghxQpeYrehXgNpKhTZDw2OKtpxG--E366UhyHMuyO_RjB9oP2LyxPlmWvE7EfL1bchVA4elV3-Xq1h4ZgLADVgi8DSoYmbmxyCk6HPS4uM1mTgbgdB4c';

export const SARAH_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuApVxuxYsQ4adBB-j3rd_FAmixzjhW_rAOstV_sfaPUFyommOTGfFszs3p6TBUIWpErcDOIxugxyWI-D-Y6gSg8TEiXiWsBwZEfPJFLIMK2Xst7ixSa1UyStPQn94OuJAUcwJcGDIZ-Q8b9oJX9KqsQQa_gIHQYgVchyQn_YFz064uStt3JnTKElkDE01Eqfc3fXkjF3AojmIzBQKdAo7xzWzTf0TmQYvymBixY4JSAuAVYJT6oWD-vjQ';
export const COLLEAGUE_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0IiPFXAof_Z1qzRK75V-sUKuKmZrYc-zzG-Xli2Hjtbb3HOs9UGlIBSbELdHHMEBGnqwu2iQ8tuVv45qXpMxPcmG_ruBsYC9njqnL8wZQ4VCFButT8udUnappYgVWLR-i0tf__jMq6YzJy5uehRwdJQbQ--rjeqxpi1cNAbHsakXtYHvm8bfLxsxV4BK0RdyPBUM-6NSoGMrWa4YAW3vwek4fqAvp2ZQ3_GgiScfjOg6NsaOWoHh4-w';
export const COLLEAGUE_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiJcpqmx6nYKxCr1r9XnHt0hvAS7xl6Go3KBLUk8z6eX01DH29rNZIvgkBXS-F1taozhoKdSNeMY9q-iwiI2h5pH_SmFCbkrNHVf7uITOEg_U-i4Lq9vWE3N_gp9xyZknfiCKN_aDnQm-6q-VRwg3ym-x1Vc7LVG1KwwIAHWcF9N3nm7ZxMTLamu3eBpfYy_9ix-iD69FW5r-VvvwZaWOB8B5NA5Pm1QOiV9kChGC-dWrMc0mrAIBLJA';
export const COLLEAGUE_3 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ5p2CmjuG803kwQ_iZsPAzkSMZkFhavP3AjfWAJQ7SSxKTFE5G7YyPqsd0176YZqZSFxKaRy44MDt7Pb34b9vU59EXBkzgdZeJmORAIwFZGdlIVyRaMU9m_I686EfNrlD1VA32uCspFkaPNeI_NxeoI5C8OXg5pLH_8D_Wzvfk8MbBgNw2x3qzr4xurpa23NAJLHFA2Erqo17QEJTowJpVeNeZCP4o9CPRCvu7wEFVPdmHkZ-CiFJIg';

export const CURRENT_USER: UserProfile = {
  name: 'Sarah Connor',
  email: 'sarah.connor@taskpro.io',
  avatar: SARAH_AVATAR,
  role: 'Lead Product Designer',
  appsConnected: 3,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Q3 Product Strategy Deck Review',
    description: 'Finalize go-to-market slide notes and financial projections before executive sync.',
    fullDescription: 'Finalize go-to-market slide notes, verify ARR metrics with finance team, and draft key takeaways for the executive leadership presentation tomorrow morning.',
    project: 'Q3 Strategy',
    category: 'Work',
    priority: 'high',
    status: 'in_progress',
    dueDate: 'Today, Oct 24',
    dueTime: '3:00 PM (EDT)',
    isOverdue: true,
    overdueText: 'Overdue by 2h • Today 3:00 PM',
    isPinned: true,
    subtasks: [
      { id: 'st-1-1', title: 'Review slide 1 to 10 narrative flow', completed: true },
      { id: 'st-1-2', title: 'Update ARR revenue comparison charts with Q2 actuals', completed: true },
      { id: 'st-1-3', title: 'Add customer testimonial quote from Acme Corp', completed: true },
      { id: 'st-1-4', title: 'Align with Sales VP on pipeline projections', completed: false, isUrgent: true },
      { id: 'st-1-5', title: 'Export high-res PDF and share in #exec-sync channel', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
      { name: 'Elena Rostova', avatar: COLLEAGUE_1 },
      { name: 'Marcus Vance', avatar: COLLEAGUE_2 },
    ],
    attachments: [
      { id: 'att-1', name: 'arch_guidelines_v2.pdf', size: '2.4 MB', type: 'application/pdf' },
    ],
    tags: ['Strategy', 'Q3'],
    reminder: {
      enabled: true,
      timing: '15m',
    },
    activities: [
      {
        id: 'act-1',
        author: 'Sarah Connor',
        avatar: SARAH_AVATAR,
        text: 'Confirmed preliminary ARR graphs with Dave from Accounting. Waiting on Q2 net churn adjustments before slide 8 lock.',
        time: '1 hr ago',
      },
      {
        id: 'act-2',
        author: 'System Notification',
        text: 'Deadline elapsed without completion mark. High-priority escalation ping triggered.',
        time: '3:00 PM',
        isSystem: true,
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Revamp Mobile Navigation & Glassmorphic Tabs',
    description: 'Optimize safe-area padding and polish active transitions for tabs.',
    fullDescription: 'Audit safe-area padding on notch devices, adjust active tab spring kinetics, and ensure optical alignment of icon labels across viewports.',
    project: 'Design System 2.0',
    category: 'Design System',
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'Due Tomorrow, 11:00 AM',
    dueTime: '11:00 AM',
    isOverdue: false,
    isPinned: false,
    subtasks: [
      { id: 'st-2-1', title: 'Audit safe area insets on iOS and Android', completed: true },
      { id: 'st-2-2', title: 'Implement fluid spring animations for active tab indicator', completed: false },
      { id: 'st-2-3', title: 'Test high-contrast mode accessibility tokens', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: COLLEAGUE_3 },
    ],
    attachments: [
      { id: 'att-2', name: 'navigation_flow_v3.fig', size: '14.2 MB', type: 'application/figma' },
      { id: 'att-3', name: 'glass_tab_specs.png', size: '1.8 MB', type: 'image/png' },
    ],
    tags: ['Design System', 'Mobile', 'UI'],
    reminder: {
      enabled: true,
      timing: '30m',
    },
  },
  {
    id: 'task-3',
    title: 'Morning 5km Run & Core Workout',
    description: 'Completed outdoor route via Parkside trail. Heart rate avg 148 bpm.',
    fullDescription: 'Morning cardio session: 5.2km outdoor sprint + 15 min core cooldown with planks and resistance bands.',
    category: 'Fitness',
    priority: 'low',
    status: 'completed',
    dueDate: 'Today',
    dueTime: '08:00 AM',
    completedAt: '8:15 AM',
    isOverdue: false,
    isPinned: false,
    metrics: {
      calories: '420 kcal burned',
      duration: '27m 40s',
    },
    subtasks: [
      { id: 'st-3-1', title: '5km outdoor route via Parkside', completed: true },
      { id: 'st-3-2', title: 'Core cool down and hydration', completed: true },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
    ],
    tags: ['Fitness', 'Morning Routine'],
  },
  {
    id: 'task-4',
    title: 'Design System Architecture Review',
    description: 'Standardize color semantics for high-contrast accessibility tokens across Web and iOS applications.',
    fullDescription: 'Standardize color semantics for high-contrast accessibility tokens across Web and iOS applications. Verify contrast ratios meet WCAG AAA standards.',
    project: 'Design Tokens',
    category: 'Work',
    priority: 'high',
    status: 'todo',
    dueDate: 'Oct 24, 2024',
    dueTime: '03:00 PM',
    isOverdue: false,
    isPinned: false,
    subtasks: [
      { id: 'st-4-1', title: 'Prepare wireframe sketches', completed: true },
      { id: 'st-4-2', title: 'Review typography scale', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
      { name: 'Elena Rostova', avatar: COLLEAGUE_1 },
    ],
    attachments: [
      { id: 'att-4', name: 'arch_guidelines_v2.pdf', size: '2.4 MB', type: 'application/pdf' },
    ],
    tags: ['Architecture', 'Tokens'],
    reminder: {
      enabled: true,
      timing: '30m',
    },
  },
  {
    id: 'task-5',
    title: 'Quarterly OKR Planning & Team Capacity Sync',
    description: 'Draft engineering and design headcount allocation for Q4 product bets.',
    fullDescription: 'Meet with leadership team to outline key results and deliverable scope for upcoming quarter.',
    project: 'Management',
    category: 'Work',
    priority: 'medium',
    status: 'todo',
    dueDate: 'Friday, Oct 27',
    dueTime: '02:00 PM',
    isOverdue: false,
    subtasks: [
      { id: 'st-5-1', title: 'Compile design backlog velocity data', completed: true },
      { id: 'st-5-2', title: 'Draft headcount budget spreadsheet', completed: false },
      { id: 'st-5-3', title: 'Sync with VP of Engineering', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
      { name: 'Marcus Vance', avatar: COLLEAGUE_2 },
    ],
    tags: ['OKRs', 'Planning'],
  },
  {
    id: 'task-6',
    title: 'Cognitive Science & Interaction Design Paper',
    description: 'Review Chapter 4 on Mental Models in Adaptive AI Interfaces.',
    fullDescription: 'Deep reading session for continuous learning on UX psychology and micro-animations.',
    category: 'Study',
    priority: 'low',
    status: 'todo',
    dueDate: 'Sunday, Oct 29',
    dueTime: '06:00 PM',
    subtasks: [
      { id: 'st-6-1', title: 'Highlight key passages on attentional fatigue', completed: false },
      { id: 'st-6-2', title: 'Synthesize notes into Notion library', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
    ],
    tags: ['Reading', 'Cognition'],
  },
  {
    id: 'task-7',
    title: 'Renew Passport & Travel Health Insurance',
    description: 'Submit online expedited renewal form for November international conference.',
    fullDescription: 'Prepare documents, take certified passport photo, and submit application before deadline.',
    category: 'Personal',
    priority: 'medium',
    status: 'todo',
    dueDate: 'Tomorrow, 5:00 PM',
    dueTime: '05:00 PM',
    subtasks: [
      { id: 'st-7-1', title: 'Digitize passport photo with official guidelines', completed: true },
      { id: 'st-7-2', title: 'Submit renewal application portal', completed: false },
    ],
    assignees: [
      { name: 'Sarah Connor', avatar: SARAH_AVATAR },
    ],
    tags: ['Personal', 'Travel'],
  },
];
