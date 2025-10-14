# Feedback Tracking Strategy

## What Does Feedback Track?

The feedback system tracks **three levels** of data for maximum analytics flexibility:

### 1. **Session Level** (`sessionId`)
- **Purpose**: Track feedback for specific coaching sessions
- **Use Case**: "How did this particular session perform?"
- **Example Query**: "Show me all feedback for session XYZ"
- **Value**: Understand which sessions are most/least effective

### 2. **User Level** (`userId`)
- **Purpose**: Track individual user satisfaction over time
- **Use Case**: "What's this user's overall experience trend?"
- **Example Query**: "Show me all feedback from user ABC"
- **Value**: Identify power users, track satisfaction trends, personalize experience

### 3. **Organization Level** (`orgId`)
- **Purpose**: Track business/company-wide satisfaction
- **Use Case**: "How satisfied are users from Company X?"
- **Example Query**: "Show me all feedback from organization DEF"
- **Value**: Enterprise reporting, identify which orgs need attention

## Database Schema

```typescript
feedback: defineTable({
  // Tracking IDs
  orgId: v.optional(v.id("orgs")),           // Which business
  userId: v.optional(v.id("users")),         // Which user
  sessionId: v.optional(v.id("sessions")),   // Which session
  
  // Feedback Data
  overallRating: v.optional(v.number()),     // 1-5 overall experience
  uxRating: v.optional(v.number()),          // 1-5 UX rating
  growMethodRating: v.optional(v.number()),  // 1-5 GROW method rating
  easeOfUse: v.optional(v.string()),         // Multiple choice
  helpfulness: v.optional(v.string()),       // Multiple choice
  willingToPay: v.optional(v.string()),      // Pricing willingness
  improvements: v.optional(v.string()),      // Free text suggestions
  
  createdAt: v.number(),
})
```

## Analytics Capabilities

### By Session
```sql
-- Find all feedback for a specific session
SELECT * FROM feedback WHERE sessionId = 'xyz'

-- Average ratings per session
SELECT sessionId, AVG(overallRating), AVG(uxRating), AVG(growMethodRating)
FROM feedback
GROUP BY sessionId
```

### By User
```sql
-- User satisfaction trend over time
SELECT userId, createdAt, overallRating
FROM feedback
WHERE userId = 'abc'
ORDER BY createdAt

-- Users willing to pay
SELECT userId, willingToPay
FROM feedback
WHERE willingToPay LIKE '%Yes%'
```

### By Organization
```sql
-- Organization-wide satisfaction
SELECT orgId, AVG(overallRating) as avg_satisfaction
FROM feedback
GROUP BY orgId

-- Enterprise reporting
SELECT orgId, COUNT(*) as feedback_count, AVG(uxRating) as avg_ux
FROM feedback
WHERE orgId = 'def'
```

## Why Track All Three?

### Scenario 1: User Gives Negative Feedback
- **Session Level**: "Was this specific session bad?"
- **User Level**: "Is this user consistently unhappy?"
- **Org Level**: "Are all users from this company unhappy?"

### Scenario 2: High Satisfaction
- **Session Level**: "What made this session great?"
- **User Level**: "Is this user a promoter?"
- **Org Level**: "Should we use this org as a case study?"

### Scenario 3: Feature Improvement
- **Session Level**: "Which sessions need the most improvement?"
- **User Level**: "Which users are most engaged with feedback?"
- **Org Level**: "Which orgs should we prioritize for new features?"

## Recommendation

**Keep all three tracking levels.** This gives you:

✅ **Granular insights** - Drill down from org → user → session  
✅ **Trend analysis** - Track satisfaction over time at any level  
✅ **Segmentation** - Compare different orgs, users, or session types  
✅ **Personalization** - Tailor experience based on user history  
✅ **Enterprise reporting** - Provide org-level dashboards  
✅ **Product decisions** - Understand what features to build next

## Future Enhancements

- [ ] **Feedback Dashboard**: Visualize all three levels
- [ ] **Automated Alerts**: Notify when org/user satisfaction drops
- [ ] **Sentiment Analysis**: Analyze improvement text for themes
- [ ] **Feedback Response**: Allow team to respond to feedback
- [ ] **Export Reports**: Generate PDF reports by org/user/session
- [ ] **A/B Testing**: Compare feedback across different UX variants

---

**Current Status**: ✅ All three levels implemented and indexed  
**Data Retention**: Indefinite (no automatic deletion)  
**Privacy**: All IDs are optional for anonymous feedback support
