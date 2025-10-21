# CoachFlux MVP Feature Specification

## MVP Definition

**Minimum Viable Product:** The smallest set of features that delivers value to users and validates the core business model.

**Launch Target:** 8-12 weeks from start of development

---

## Core Features (Must Have)

### **1. Landing Page - Conversational Void ✅**

**Description:** Revolutionary landing page with AI-powered conversational interface

**Features:**
- Blank page with blinking cursor
- Real-time AI response to user input
- Framework recommendation based on input
- Fallback navigation for confused users
- Mobile responsive

**Success Criteria:**
- 60%+ of visitors type something
- 40%+ start a session
- <10% confusion rate

---

### **2. Anonymous Sessions ✅**

**Description:** Users can start coaching sessions without creating an account

**Features:**
- No signup required
- Full GROW framework experience
- Session stored temporarily (24 hours)
- Progress tracking within session
- Voice input/output

**Success Criteria:**
- 70%+ session completion rate
- <5% error rate
- Works on all major browsers

---

### **3. Session Report ✅**

**Description:** Comprehensive report generated at end of session

**Features:**
- Summary of session
- AI insights and recommendations
- Structured GROW data (Goal, Reality, Options, Will)
- Action items extracted
- Print functionality
- Email to self option

**Success Criteria:**
- 90%+ of completed sessions generate report
- 30%+ email report
- Report loads in <2 seconds

---

### **4. Email Report & Newsletter Signup**

**Description:** Capture emails and grow newsletter list

**Features:**
- Email input form
- Newsletter opt-in checkbox (not pre-checked)
- Discount code delivery (WELCOME50)
- Email template with report summary
- Unsubscribe link

**Success Criteria:**
- 30-40% email capture rate
- 25-35% newsletter opt-in
- <2% spam complaints

---

### **5. User Authentication**

**Description:** Email/password and OAuth registration/login

**Features:**
- Email/password registration
- Email verification
- Login/logout
- Password reset
- Google OAuth
- Session management
- Remember me option

**Success Criteria:**
- <5% registration abandonment
- <2% login errors
- Email verification in <5 minutes

---

### **6. User Dashboard**

**Description:** Central hub for registered users

**Features:**
- Session history (last 10 sessions)
- Quick start new session
- Framework selector
- Account settings link
- Subscription status

**Success Criteria:**
- Loads in <1 second
- 80%+ start session from dashboard
- Clear navigation

---

### **7. Session History**

**Description:** View and revisit past sessions

**Features:**
- List of all sessions
- Filter by framework
- Search by keyword
- View full report
- Delete session

**Success Criteria:**
- 50%+ users revisit past sessions
- Search works accurately
- Pagination for 100+ sessions

---

### **8. Subscription & Payment**

**Description:** Stripe integration for Pro subscriptions

**Features:**
- Pricing page
- Stripe Checkout integration
- Monthly (£9.99) and Annual (£99) plans
- Discount code application
- Subscription confirmation email
- Customer portal (Stripe-hosted)

**Success Criteria:**
- 40-60% trial-to-paid conversion
- <5% payment failures
- Checkout completes in <2 minutes

---

### **9. Framework: GROW**

**Description:** Full GROW coaching framework

**Features:**
- 5 steps (Goal, Reality, Options, Will, Review)
- AI-powered coaching questions
- Structured data extraction
- Progress tracking
- Skip functionality (2 per step)
- Voice input/output

**Success Criteria:**
- 70%+ completion rate
- <10% skip usage
- 15-25 minute average duration

---

### **10. Mobile Optimization**

**Description:** Fully responsive mobile experience

**Features:**
- Responsive design (320px+)
- Touch-friendly UI
- iOS safe area support
- Sticky progress bar
- Fixed input area
- Voice input optimized

**Success Criteria:**
- Works on iPhone 8+
- Works on Android 8+
- 90+ Lighthouse mobile score

---

## Nice to Have (Post-MVP)

### **11. Action Item Tracker**

**Description:** Manage action items from sessions

**Features:**
- Action item list
- Mark complete
- Due dates
- Email reminders
- Progress tracking

**Priority:** High (Week 13-14)

---

### **12. Additional Frameworks**

**Description:** CLEAR, COMPASS, Power-Interest Grid

**Features:**
- Framework metadata system
- Framework selection in onboarding
- Framework-specific prompts
- Framework comparison

**Priority:** High (Week 15-18)

---

### **13. Resources Library**

**Description:** Templates, guides, worksheets

**Features:**
- Resource categories
- Download tracking
- Access control (free vs pro)
- Search functionality

**Priority:** Medium (Week 19-20)

---

### **14. Progress Dashboard**

**Description:** Analytics and insights for users

**Features:**
- Sessions completed
- Action items progress
- Framework usage
- Time spent
- Growth visualization

**Priority:** Medium (Week 21-22)

---

### **15. Referral Program**

**Description:** Give £5, Get £5

**Features:**
- Unique referral link
- Referral tracking
- Credit application
- Leaderboard (optional)

**Priority:** Low (Week 23-24)

---

## Out of Scope (V2+)

- Team features
- SSO integration
- Custom branding
- API access
- Mobile apps
- Offline mode
- Multi-language support
- Video coaching
- 1-on-1 human coaching marketplace

---

## Technical Requirements

### **Performance**

- Page load: <2 seconds
- Time to interactive: <3 seconds
- API response: <500ms
- Session start: <1 second

### **Browser Support**

- Chrome 90+
- Safari 14+
- Firefox 90+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

### **Accessibility**

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Color contrast 4.5:1+

### **Security**

- HTTPS only
- CSRF protection
- XSS prevention
- Rate limiting
- Secure session management

---

## MVP Feature Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Landing Page | High | Medium | P0 |
| Anonymous Sessions | High | Low | P0 |
| Session Report | High | Medium | P0 |
| Email Capture | High | Low | P0 |
| Authentication | High | Medium | P0 |
| Dashboard | Medium | Low | P0 |
| Session History | Medium | Low | P0 |
| Payment | High | High | P0 |
| GROW Framework | High | Low | P0 |
| Mobile Optimization | High | Medium | P0 |
| Action Tracker | Medium | Medium | P1 |
| More Frameworks | High | High | P1 |
| Resources | Low | Medium | P2 |
| Progress Dashboard | Medium | High | P2 |
| Referral Program | Medium | Medium | P3 |

**P0 = MVP (Must have)**  
**P1 = Post-MVP (High priority)**  
**P2 = V1.5 (Medium priority)**  
**P3 = V2 (Low priority)**

---

## Development Timeline

### **Week 1-2: Foundation**
- Project setup
- Design system
- Landing page
- Anonymous sessions

### **Week 3-4: Core Features**
- Session report
- Email system
- Authentication
- Dashboard

### **Week 5-6: Monetization**
- Stripe integration
- Subscription management
- Payment flows
- Billing portal

### **Week 7-8: Polish**
- Mobile optimization
- Performance tuning
- Bug fixes
- Testing

### **Week 9-10: Testing & QA**
- User testing
- Security audit
- Accessibility audit
- Browser testing

### **Week 11-12: Launch Prep**
- Content creation
- Email sequences
- Analytics setup
- Monitoring

### **Week 13: Launch**
- Soft launch
- Monitor metrics
- Gather feedback
- Iterate

---

## Success Metrics (First 90 Days)

### **Acquisition**
- 10,000 landing page visits
- 6,000 sessions started (60%)
- 1,000 newsletter signups

### **Activation**
- 4,200 sessions completed (70%)
- 1,260 reports emailed (30%)
- 500 accounts created

### **Engagement**
- 3 sessions per user average
- 70% session completion rate
- 50% revisit past sessions

### **Revenue**
- 50 paid subscribers (10% of accounts)
- £500 MRR
- £6,000 ARR

### **Retention**
- 60% Day 7 retention
- 40% Day 30 retention
- <5% monthly churn

---

## Launch Checklist

### **Pre-Launch**
- [ ] All P0 features complete
- [ ] Mobile tested on real devices
- [ ] Payment flow tested end-to-end
- [ ] Email templates finalized
- [ ] Analytics tracking verified
- [ ] Legal pages published (Privacy, ToS)
- [ ] Support email setup
- [ ] Monitoring and alerts configured

### **Launch Day**
- [ ] Deploy to production
- [ ] Verify all systems operational
- [ ] Product Hunt submission
- [ ] Social media announcements
- [ ] Email to waitlist
- [ ] Monitor error rates

### **Post-Launch (Week 1)**
- [ ] Daily metrics review
- [ ] User feedback collection
- [ ] Bug triage and fixes
- [ ] A/B test setup
- [ ] Content marketing begins

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
