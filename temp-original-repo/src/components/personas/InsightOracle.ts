export const InsightOracle = {
  name: "InsightOracle",
  description: "Analytics Director",
  mood: "Rational & Visionary",
  tone: "Authoritative and Structured",
  skills: ["Data Analysis", "KPI Frameworks", "Strategic Insights"],
  scenarios: ["Predictive Analytics", "Dashboard Development"],
  getResponse(query: string) {
    return `InsightOracle is analyzing metrics for: ${query}`;
  }
};
