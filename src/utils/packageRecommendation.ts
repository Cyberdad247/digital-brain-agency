import { supabase } from '../lib/supabase';

interface PackageFeature {
  name: string;
  weight: number;
}

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  idealFor: string;
}

export const packages: Package[] = [
  {
    id: 'startup-essentials',
    name: 'Startup Essentials',
    price: 499,
    features: [
      'AI Chatbot (Basic Automation & Lead Capture)',
      'Website Performance Analysis',
      'Social Media Management (1 Platform)',
      'Email Marketing (2 Campaigns/Month)',
      'Content Creation (4 Blog Posts)',
      'Basic SEO Optimization',
      'Monthly Performance Report',
    ],
    description: 'For startups & small businesses looking for cost-effective, AI-powered growth.',
    idealFor: 'Bootstrapped startups & solopreneurs who need a solid digital foundation',
  },
  {
    id: 'growth-ready',
    name: 'Growth Ready',
    price: 999,
    features: [
      'AI Strategy & Consultation',
      'Website Optimization',
      'Social Media Management (3 Platforms)',
      'SEO Optimization',
      'Email Marketing (4 Campaigns/Month)',
      'Landing Page Creation',
      'PPC Campaign Setup',
      'Workflow Automation',
    ],
    description: 'For established businesses looking for data-driven AI-powered marketing.',
    idealFor: 'Growing businesses looking for AI-driven scalability & conversions',
  },
  {
    id: 'ai-growth-engine',
    name: 'AI Growth Engine',
    price: 2999,
    features: [
      'Custom AI Chatbots',
      'Comprehensive SEO Strategy',
      'Website Redesign',
      'Social Media & Paid Ads',
      'PPC Campaign Optimization',
      'Landing Page A/B Testing',
      'Email Marketing & CRM Automation',
      'Quarterly Growth Strategy Session',
    ],
    description: 'Advanced AI-powered marketing solution with comprehensive features.',
    idealFor: 'Growing businesses looking for AI-driven scalability & conversions',
  },
];

export async function recommendPackage(transcription: string): Promise<Package> {
  // Extract key features and requirements from transcription
  const keyFeatures = analyzeTranscription(transcription);

  // Calculate package scores
  const scores = packages.map((pkg) => ({
    package: pkg,
    score: calculatePackageScore(pkg, keyFeatures),
  }));

  // Sort by score and get the best match
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0].package;

  // Store recommendation in Supabase
  await storeRecommendation(transcription, bestMatch);

  return bestMatch;
}

function analyzeTranscription(transcription: string): PackageFeature[] {
  const features: PackageFeature[] = [];

  // Keywords and their weights
  const keywords = {
    budget: { weight: 0.8, terms: ['affordable', 'cheap', 'cost', 'price', 'budget'] },
    growth: { weight: 0.6, terms: ['grow', 'scale', 'expand', 'increase'] },
    automation: { weight: 0.7, terms: ['automate', 'automatic', 'bot', 'ai'] },
    marketing: { weight: 0.5, terms: ['marketing', 'advertise', 'promote'] },
    social: { weight: 0.6, terms: ['social', 'facebook', 'instagram', 'linkedin'] },
    seo: { weight: 0.7, terms: ['seo', 'search', 'ranking', 'organic'] },
  };

  // Analyze transcription for keywords
  Object.entries(keywords).forEach(([feature, { weight, terms }]) => {
    const matches = terms.some((term) => transcription.toLowerCase().includes(term.toLowerCase()));
    if (matches) {
      features.push({ name: feature, weight });
    }
  });

  return features;
}

function calculatePackageScore(pkg: Package, features: PackageFeature[]): number {
  let score = 0;

  features.forEach((feature) => {
    // Check if package features match the extracted requirements
    const hasFeature = pkg.features.some((pkgFeature) =>
      pkgFeature.toLowerCase().includes(feature.name.toLowerCase())
    );

    if (hasFeature) {
      score += feature.weight;
    }
  });

  return score;
}

async function storeRecommendation(transcription: string, recommendation: Package) {
  try {
    await supabase.from('recommendations').insert({
      transcription,
      package_id: recommendation.id,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error storing recommendation:', error);
  }
}
