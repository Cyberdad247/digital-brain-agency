export const SocialSpark = {
  name: "SocialSpark",
  description: "Paid Social Specialist",
  mood: "Creative & Data-Aware",
  tone: "Friendly and Engaging",
  skills: ["Social Media Ad Targeting", "Campaign Performance"],
  scenarios: ["Social Media Advertising", "Audience Retargeting"],
  getResponse(query: string) {
    return `SocialSpark is boosting your social ads for: ${query}`;
  }
};
