import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getDocs() {
  // Return TumaTask documentation categories
  return [
    {
      id: 'setting-up-account',
      title: 'Setting up your account',
      tags: ['account', 'setup', 'getting-started'],
      publish: 'published',
      content: 'Complete guide to account setup, profile verification, and getting started on TumaTask. Learn how to create your account, verify your identity, set up your profile, and start earning money through tasks.',
      coverUrl: '/assets/images/docs/account-setup.webp',
      metaTitle: 'Setting up your TumaTask Account - Complete Guide',
      totalViews: 1250,
      totalShares: 45,
      description: 'Learn how to create and configure your TumaTask account for maximum success',
      totalComments: 12,
      createdAt: new Date().toISOString(),
      totalFavorites: 89,
      metaKeywords: ['tumatask', 'account setup', 'kenya', 'earning money'],
      metaDescription: 'Step-by-step guide to setting up your TumaTask account and start earning in Kenya',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
    {
      id: 'payments',
      title: 'Payments',
      tags: ['payments', 'mpesa', 'withdrawals'],
      publish: 'published',
      content: 'Everything you need to know about payments, withdrawals, and earnings on TumaTask. Learn about M-Pesa integration, payment processing times, withdrawal limits, and how to maximize your earnings.',
      coverUrl: '/assets/images/docs/payments.webp',
      metaTitle: 'TumaTask Payments Guide - M-Pesa & Withdrawals',
      totalViews: 2100,
      totalShares: 78,
      description: 'Everything you need to know about payments, withdrawals, and earnings',
      totalComments: 23,
      createdAt: new Date().toISOString(),
      totalFavorites: 156,
      metaKeywords: ['tumatask payments', 'mpesa', 'withdrawals', 'kenya'],
      metaDescription: 'Complete guide to TumaTask payment system and M-Pesa withdrawals in Kenya',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
    {
      id: 'guarantees-assurances',
      title: 'Guarantees and assurances',
      tags: ['safety', 'security', 'protection'],
      publish: 'published',
      content: 'Safety measures, insurance, and protection for all TumaTask users. Learn about user verification processes, escrow protection, dispute resolution, and our commitment to keeping your transactions safe.',
      coverUrl: '/assets/images/docs/safety.webp',
      metaTitle: 'TumaTask Safety & Security Guarantees',
      totalViews: 980,
      totalShares: 34,
      description: 'Safety measures, insurance, and protection for all users',
      totalComments: 8,
      createdAt: new Date().toISOString(),
      totalFavorites: 67,
      metaKeywords: ['tumatask safety', 'security', 'protection', 'kenya'],
      metaDescription: 'How TumaTask protects users and ensures safe transactions in Kenya',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
    {
      id: 'delivery',
      title: 'Delivery',
      tags: ['delivery', 'logistics', 'transport'],
      publish: 'published',
      content: 'Guide to delivery tasks, best practices, and success tips on TumaTask. Learn about package delivery guidelines, route optimization, customer service excellence, and delivery protocols in Kenyan cities.',
      coverUrl: '/assets/images/docs/delivery.webp',
      metaTitle: 'TumaTask Delivery Guide - Earn with Deliveries',
      totalViews: 1450,
      totalShares: 56,
      description: 'Guide to delivery tasks, best practices, and success tips',
      totalComments: 15,
      createdAt: new Date().toISOString(),
      totalFavorites: 112,
      metaKeywords: ['tumatask delivery', 'package delivery', 'logistics kenya'],
      metaDescription: 'How to succeed with delivery tasks on TumaTask in Kenya',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
    {
      id: 'product-service-issues',
      title: 'Problem with the product/service',
      tags: ['support', 'issues', 'troubleshooting'],
      publish: 'published',
      content: 'How to handle issues and resolve problems effectively on TumaTask. Learn troubleshooting steps for common issues, how to report problems, and find quick solutions to keep your tasks running smoothly.',
      coverUrl: '/assets/images/docs/support.webp',
      metaTitle: 'TumaTask Support - Resolving Issues & Problems',
      totalViews: 890,
      totalShares: 28,
      description: 'How to handle issues and resolve problems effectively',
      totalComments: 19,
      createdAt: new Date().toISOString(),
      totalFavorites: 78,
      metaKeywords: ['tumatask support', 'problem solving', 'help kenya'],
      metaDescription: 'Get help with TumaTask issues and find solutions quickly',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
    {
      id: 'return-refund',
      title: 'Return & refund',
      tags: ['refund', 'return', 'money-back'],
      publish: 'published',
      content: 'Refund policies and procedures for task-related issues on TumaTask. Understand refund eligibility criteria, claim process, timeline expectations, and dispute resolution for refund requests in Kenya.',
      coverUrl: '/assets/images/docs/refunds.webp',
      metaTitle: 'TumaTask Refund Policy - Returns & Money Back',
      totalViews: 720,
      totalShares: 22,
      description: 'Refund policies and procedures for task-related issues',
      totalComments: 11,
      createdAt: new Date().toISOString(),
      totalFavorites: 54,
      metaKeywords: ['tumatask refund', 'return policy', 'money back kenya'],
      metaDescription: 'Understanding TumaTask refund policies and how to request refunds',
      comments: [],
      author: {
        name: 'TumaTask Team',
        avatarUrl: '/assets/images/avatars/tumatask-team.webp',
      },
      favoritePerson: [],
    },
  ];
}

// ----------------------------------------------------------------------

export async function getDoc(title: string) {
  const docs = await getDocs();
  const doc = docs.find(d => d.id === title || d.title.toLowerCase().includes(title.toLowerCase()));
  
  return { doc };
}

// ----------------------------------------------------------------------

export async function getLatestDocs(title: string) {
  const docs = await getDocs();
  const latestDocs = docs.filter(d => d.id !== title).slice(0, 4);
  
  return { latestDocs };
}
