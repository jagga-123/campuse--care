const categoryRules = [
  { keywords: ['wifi', 'internet', 'network', 'router'], category: 'Network', department: 'IT Support' },
  { keywords: ['water', 'leak', 'plumbing', 'pipeline'], category: 'Maintenance', department: 'Civil' },
  { keywords: ['light', 'electric', 'power', 'fan', 'projector'], category: 'Infrastructure', department: 'Electrical' },
  { keywords: ['hostel', 'mess', 'food', 'canteen'], category: 'Facilities', department: 'Administration' },
  { keywords: ['security', 'theft', 'harassment', 'fight'], category: 'Safety', department: 'Security' }
];

export function categorizeComplaint(text = '') {
  const normalized = text.toLowerCase();
  const match = categoryRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match || { category: 'General', department: 'General' };
}

export function detectPriority({ title = '', description = '', emergency = false } = {}) {
  const text = `${title} ${description}`.toLowerCase();

  if (emergency || /fire|injury|attack|danger|critical|electrical shock/.test(text)) {
    return 'Critical';
  }

  if (/water leak|power outage|security|broken|unsafe|blocked/.test(text)) {
    return 'High';
  }

  if (/slow|delay|noise|minor|issue/.test(text)) {
    return 'Medium';
  }

  return 'Low';
}

export function buildAiSuggestion(complaint) {
  const categoryData = categorizeComplaint(`${complaint.title} ${complaint.description}`);
  const priority = detectPriority(complaint);

  return {
    category: categoryData.category,
    department: categoryData.department,
    priority,
    summary: `${categoryData.category} issue routed to ${categoryData.department} with ${priority} priority.`
  };
}
