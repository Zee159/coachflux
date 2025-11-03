# Knowledge Base Expansion Plan

## Current State
- **10 scenarios** loaded (Management Bible)
- Categories: performance_management, feedback, team_dynamics, change_management, leadership, delegation, wellbeing

## Expansion Strategy: 40+ New Scenarios

### Priority 1: Career Development (10 scenarios)
1. **Career Pivot** - Transitioning industries/roles
2. **Getting Promoted** - Visibility, performance, relationships
3. **Job Search Strategy** - Hidden job market, networking
4. **Imposter Syndrome** - Managing self-doubt
5. **Salary Negotiation** - Total compensation tactics
6. **Work-Life Boundaries** - Saying no professionally
7. **Skill Development** - T-shaped professional model
8. **Professional Networking** - Building authentic connections
9. **Peer to Manager** - Leading former peers
10. **Remote Work Success** - Visibility and productivity

### Priority 2: Personal Development (10 scenarios)
11. **Building Confidence** - Competence + Courage + Self-Compassion
12. **Goal Setting** - SMART + 3-tier system
13. **Habit Formation** - 4 laws of behavior change
14. **Decision Making** - Frameworks and avoiding traps
15. **Mental Resilience** - Bouncing back from setbacks
16. **Effective Communication** - Clarity, empathy, impact
17. **Time Management** - Eisenhower Matrix, deep work
18. **Overcoming Procrastination** - Understanding resistance
19. **Managing Stress** - Healthy coping mechanisms
20. **Growth Mindset** - Fixed vs growth mindset

### Priority 3: Relationships & Communication (5 scenarios)
21. **Difficult Conversations** - SBI framework
22. **Conflict Resolution** - Win-win outcomes
23. **Giving Feedback** - Specific, timely, actionable
24. **Receiving Feedback** - Growth opportunity
25. **Building Trust** - Consistency and vulnerability

### Priority 4: Financial Planning (5 scenarios)
26. **Budgeting Basics** - 50/30/20 rule
27. **Emergency Fund** - 3-6 months expenses
28. **Debt Reduction** - Avalanche vs snowball
29. **Investing 101** - Index funds, diversification
30. **Retirement Planning** - Compound interest, 401k

### Priority 5: Health & Wellness (5 scenarios)
31. **Sleep Optimization** - Sleep hygiene, circadian rhythm
32. **Stress Management** - Physical and mental techniques
33. **Exercise Habits** - Starting and maintaining
34. **Nutrition Basics** - Sustainable eating
35. **Mental Health** - When to seek help

### Priority 6: Productivity & Focus (5 scenarios)
36. **Deep Work** - Cal Newport's framework
37. **Time Blocking** - Structured scheduling
38. **Email Management** - Inbox zero strategies
39. **Meeting Efficiency** - Running effective meetings
40. **Focus Techniques** - Pomodoro, flow state

## Implementation Approach

### Phase 1: Generate Content (Week 1-2)
- Use AI to draft scenarios based on proven frameworks
- Each scenario: 300-500 words
- Include: principles, tactics, examples, common mistakes
- Format: markdown with clear structure

### Phase 2: Review & Refine (Week 3)
- Ensure accuracy and actionability
- Add specific frameworks (SBIR, 10-10-10, etc.)
- Include metrics and timelines where relevant
- Remove fluff, keep practical

### Phase 3: Load into Database (Week 4)
- Run seed script: `npx convex run seedKnowledgeExpanded:seed`
- Verify embeddings generated correctly
- Test RAG retrieval with sample queries
- Monitor relevance scores

### Phase 4: Monitor & Iterate (Ongoing)
- Track which scenarios are retrieved most
- Identify gaps in coverage
- Add scenarios based on user goals
- Update existing scenarios with new research

## Quality Standards

Each scenario must include:
✅ Clear framework or model
✅ Actionable steps
✅ Common mistakes to avoid
✅ Real-world examples
✅ Measurable outcomes
✅ 300-500 words (concise but complete)

## Success Metrics

- **Coverage**: 80%+ of user goals match at least 2 scenarios
- **Relevance**: Average RAG score > 0.7
- **Usage**: Knowledge cited in 60%+ of coaching sessions
- **Quality**: User feedback on knowledge helpfulness

## Next Steps

1. Generate first 10 scenarios (Career Development)
2. Test with real coaching sessions
3. Measure impact on session quality
4. Iterate based on feedback
5. Continue with remaining categories

## Long-Term Vision

- **100+ scenarios** covering all coaching topics
- **Domain-specific collections** (tech, healthcare, finance, etc.)
- **User-contributed scenarios** (crowdsourced wisdom)
- **Continuous learning** (update scenarios with new research)
- **Personalized knowledge** (scenarios tailored to user industry/role)
