/**
 * ENHANCED Health & Wellness Scenarios
 *
 * Each scenario supplies ~1,200 words of science-backed frameworks, scripts, checklists, troubleshooting, and real-world examples.
 * Run: npx convex run seedHealthEnhanced:seed
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface HealthEnhancedScenario {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

const toKnowledgeEmbeddingArgs = (scenario: HealthEnhancedScenario) => ({
  source: scenario.source,
  category: scenario.category,
  title: scenario.title,
  content: scenario.content,
  tags: [...scenario.tags]
});

export const HEALTH_SCENARIOS_ENHANCED: HealthEnhancedScenario[] = [
  {
    source: "health_enhanced",
    category: "sleep_optimization",
    title: "Sleep Optimization Blueprint: Designing a High-Performance Rest System",
    content: `Great sleep is a system, not an accident. This blueprint helps you build a replicable routine that delivers deep, restorative sleep even during high-stress seasons. Expect data-backed frameworks, bedtime and morning scripts, troubleshooting for common barriers, and accountability tools you can implement tonight.

MISSION SNAPSHOT
Objective: Achieve 7.5-9 hours of high-quality sleep with >85% sleep efficiency, consistent wake/bed times within a 30-minute window, and minimal night awakenings.
Components: Chronotype Assessment, Evening Wind-Down Ritual, Sleep Environment Audit, Nutrition & Supplement Timing Guide, Travel Recovery Protocol.

PHASE 1: BASELINE & DIAGNOSTIC (DAY 0-3)
1. Data Collection
   - Track current sleep for three nights using wearable, app, or handwritten log (bedtime, wake time, awakenings, caffeine/alcohol intake, evening screen exposure, stress level).
   - Calculate sleep efficiency: (Total sleep time ÷ time in bed) × 100. Goal is >85%.
   - Document daytime energy on 1-10 scale and cognitive performance windows.

2. Chronotype & Lifestyle Audit
   - Use validated chronotype quiz (Morning Lark, Hummingbird, Night Owl). Align sleep schedule to natural rhythm within constraints.
   - Work schedule mapping: note earliest obligations, commute time, family demands.
   - Identify sleep sabotagers: evening work, late meals, doom scrolling, rumination.

3. Medical Considerations
   - Screen for sleep disorders: loud snoring, gasping, restless legs, frequent awakenings, jaw clenching. If present, schedule consultation with sleep specialist before deep optimization.
   - Review medications and supplements with physician to identify insomnia contributors.

PHASE 2: ENVIRONMENT ENGINEERING (DAY 4-7)
1. Bedroom Audit Checklist
   - Darkness: Install blackout curtains, cover LEDs, use sleep mask.
   - Temperature: Set thermostat 60-67°F (15-19°C). Use cooling mattress pad if required.
   - Sound: White noise machine or earplugs for urban environments.
   - Air Quality: Open window for 10 minutes daily, add air purifier if allergens.
   - Mattress & Pillow: Evaluate support, replace if older than 8 years. Align pillow height with side/back sleeping preference.

2. Digital Hygiene
   - Remove work devices from bedroom. Charge phone outside room or use Do Not Disturb with emergency bypass only for critical contacts.
   - Create 30-minute buffer between last screen exposure and bedtime. If necessary, use blue-light blocking glasses and Night Shift mode but still aim to power down.

3. Pre-Bed Nutritional Guidelines
   - Final meal at least 2-3 hours before bed, balanced with protein, complex carbs, healthy fats.
   - Avoid caffeine after 1 PM; track sensitivity (some need earlier cut-off).
   - Limit alcohol; if consumed, stop 4 hours before bed, follow with water.
   - Hydration window: reduce fluid intake 90 minutes before bed to minimize awakenings.

PHASE 3: EVENING RITUAL (60-MINUTE SLEEP RUNWAY)
1. 60 Minutes Before Bed: Transition
   - Set warm lighting (lamps, smart bulbs). Run dishwasher/laundry earlier to avoid noise.
   - Capture lingering to-dos in “Brain Dump” list. Close open loops to prevent rumination.

2. 30 Minutes Before Bed: Wind-Down Script
   - Option A: Five-Senses Routine (dim lights, soft instrumental music, lavender diffuser, gentle stretching, gratitude journaling).
   - Option B: Guided Relaxation (box breathing 5 cycles, progressive muscle relaxation, visualize ideal tomorrow morning).

3. Bedtime Routine (10 Minutes)
   - Hygiene: brush, floss, skincare—same order nightly to cue brain.
   - Clothes: wear sleep-only attire to reinforce association.
   - Sleep mantra: “This is my time to recover. My body knows how to sleep.”

PHASE 4: MORNING RESET PROTOCOL
1. Consistent Wake Time
   - Set alarm for same time daily (weekend variation max 30 minutes). Use sunrise alarm for gentler wake.
   - Immediately exit bed; standing sunlight exposure for 5-10 minutes within first hour to anchor circadian rhythm. If dark, use 10,000 lux light box.

2. Morning Movement & Fuel
   - Incorporate 5-minute mobility or yoga flow to raise core temperature gradually.
   - Hydrate with 16 oz water; add pinch of salt and splash of citrus for electrolytes.
   - Delay caffeine 60-90 minutes post-wake to align with cortisol cycle and reduce afternoon crashes.

PHASE 5: TROUBLESHOOTING LIBRARY
Issue: Mind racing at bedtime.
   - Solution: “Not Now” script—acknowledge thought, write on bedside pad, schedule 10-minute worry time next afternoon. Use cognitive shuffle (visualize random objects) to disengage problem-solving brain.

Issue: Multiple night awakenings.
   - Solution: Check room temperature, reduce alcohol, evaluate sleep apnea symptoms. If awake >15 minutes, get out of bed, read paper book in dim light, return when sleepy.

Issue: Shift work or on-call schedule.
   - Solution: Anchor sleep as best as possible around core sleep block. Use blackout curtains and white noise for daytime sleep. Stack naps (90-minute full cycle) to compensate. Supplement with melatonin (0.3-1 mg) under medical guidance when flipping schedules.

Issue: Travel across time zones.
   - Solution: Pre-adjust by 30-60 minutes daily three days prior. Upon arrival, expose to local morning light, avoid naps >30 minutes. Use hydration + high-protein meals to stabilize energy.

Issue: Parents of young children.
   - Solution: Split shifts with partner, schedule catch-up naps (20 minutes mid-day). Utilize calming bedtime routine for child to reduce unpredictable interruptions.

TOOLS & TEMPLATES
1. Sleep Command Center Spreadsheet
   - Tabs: Sleep Log, Trigger Tracker, Intervention Checklist, Energy Ratings, Sleep Efficiency Graph.

2. Accountability Scripts
   - Partner: “My sleep goal protects both our moods. Can we agree on screens-off together at 10 PM?”
   - Roommate: “I’m experimenting with a 10:30 PM lights-out window. Would it work to keep TV volume lower after that?”

3. Supplement Guide (consult doctor first)
   - Magnesium glycinate 200-400 mg evening.
   - Glycine 3 g before bed for improved sleep quality.
   - Chamomile or tart cherry tea 60 minutes before bed.
   - Caution: avoid high-dose melatonin; start micro-dose if necessary.

4. Sleep Emergency Plan
   - If two rough nights occur: scale back evening commitments, prioritize wind-down ritual, take 20-minute afternoon nap, avoid caffeine after 11 AM, consult physician if persistent.

CASE STUDIES
Case 1: Product leader with late-night work habit
   - Implemented 9:30 PM shutdown ritual, scheduled next-day tasks before leaving office, removed laptop from bedroom.
   - Result: sleep efficiency increased from 72% to 88% in 30 days, afternoon productivity improved.

Case 2: Entrepreneur with frequent travel
   - Created travel sleep kit (eye mask, white noise app, magnesium). Adjusted schedule 15 minutes earlier daily before eastbound trips.
   - Maintained average 7 hours sleep even across time zones; reported reduced jet lag.

Case 3: Parent of toddler
   - Split nighttime responsibilities with partner, introduced “windowed” bedtimes to ensure one parent could rest 4-hour block uninterrupted.
   - Added 20-minute mid-day nap + 10-minute evening stretch routine. Energy levels normalized within 6 weeks.

Remember: Sleep is a foundational performance metric. When you build a repeatable system—anchored wake time, thoughtful wind-down, optimized environment—you remove the guesswork and make restorative rest inevitable, even when life gets loud.`,
    tags: [
      "sleep",
      "recovery",
      "circadian_rhythm",
      "stress_management",
      "high_performance"
    ]
  },
  {
    source: "health_enhanced",
    category: "stress_management",
    title: "Stress Resilience Operating System: Completing the Stress Cycle Daily",
    content: `Stress becomes toxic only when it remains stuck in your system. This operating system helps you identify stressors, process the physiological response, and deploy rituals that turn pressure into purposeful energy. Expect neuroscience insights, scripts for boundary setting, and troubleshooting across remote work, leadership roles, and caregiving.

MISSION SNAPSHOT
Objective: Reduce chronic stress load by completing the stress cycle every 24 hours, maintaining heart rate variability (HRV) baseline, and restoring focus and emotional regulation in under 15 minutes when triggered.
Components: Stress Mapping Canvas, Somatic Release Toolkit, Cognitive Reframe Scripts, Recovery Ritual Planner, Team Communication Templates.

PHASE 1: MAP THE STRESS LANDSCAPE
1. Stressor Inventory
   - List recurring stress triggers across environments (workload, interpersonal, financial, caregiving). Rate intensity 1-10 and frequency.
   - Identify controllable vs. uncontrollable factors. Highlight top 3 leverage points for intervention.

2. Stress Signature Awareness
   - Document early warning signs: physical (tight jaw, stomach knots), emotional (irritability, numbness), behavioral (doom scrolling, avoiding decisions).
   - Use the Stress Signature Tracker for two weeks to note triggers, responses, and recovery methods used.

3. Nervous System Baseline
   - Measure resting heart rate, HRV if wearable available. Note sleep quality and digestion patterns as indicators of chronic stress load.

PHASE 2: COMPLETE THE STRESS CYCLE DAILY
1. Primary Release Rituals (choose 2 daily)
   - Physical: 20-minute brisk walk, interval training, dance break, shake therapy (wiggle full body for 2 minutes).
   - Breathing: Physiological sigh (inhale, inhale again, long exhale) repeated 5 times; box breathing 4-4-4-4; resonance breathing 5.5 breaths per minute.
   - Social: Call supportive friend, team gratitude circle, hug lasting 20 seconds.
   - Laughter: Watch comedic clip, follow laughter yoga routine.

2. Emotional Processing
   - Script: “I’m feeling [emotion]. It makes sense because [context]. What do I need?”
   - Practice naming emotions accurately (use emotion wheel). Replace “stressed” with specific descriptors (overwhelmed, anxious, angry).
   - Journaling template: Situation → Thought → Feeling → Body Sensation → Action Taken → Next Best Step.

3. Cognitive Reappraisal
   - Thought reframing script: “I’m telling myself everything will collapse. Is there evidence? What’s the most empowering true story I can tell instead?”
   - Use the Stress Perception Ladder: Catastrophic → Challenge → Opportunity → Mastery narrative.

PHASE 3: PROACTIVE STRESS BUFFERING
1. Bookend Rituals
   - Morning Activation (10 minutes): light exposure, movement, intention setting (“Today I will protect my deep work block and complete the project draft.”).
   - Evening Decompression (15 minutes): review wins, gratitude, nervous system downshift (stretching or breathing).

2. Energy Budgeting
   - Weekly planning: allocate high-focus tasks when energy peaks, schedule recovery blocks afterward.
   - Protect white space: 5-minute buffer between meetings to reset.

3. Boundaries & Communication Scripts
   - Declining new work: “I’m at capacity with project X. I can take this on if we pause Y or extend the deadline.”
   - Requesting support: “I’m noticing signs of overload (irritability, sleep disruption). I need coverage for Friday afternoon to reset and complete the project at my best.”
   - Team norm-setting: “After-hours messages are for emergencies only. Let’s use scheduled send for non-urgent items.”

PHASE 4: STRESS TRIAGE FOR ACUTE EVENTS
1. Rapid Response Protocol (under 5 minutes)
   - Pause: name the trigger.
   - Breath: two physiological sighs.
   - Move: shoulder rolls, shake arms.
   - Plan: ask, “What’s the smallest next step?” Execute within 60 seconds.

2. Post-Crisis Debrief
   - Within 24 hours, journal what happened, how body responded, what helped, what support is needed.
   - Share with trusted partner or coach to integrate learning.

3. Recovery Sprint (24-48 hours)
   - Increase sleep by 60 minutes, hydrate, focus on nutrient-dense meals, reduce stimulants.
   - Engage in restorative activity (nature walk, creative hobby).

PHASE 5: LONG-TERM RESILIENCE BUILDING
1. Capacity Expansion Plan
   - Train stress tolerance via cold exposure (cold shower 30 seconds), vigorous exercise, mindfulness practice.
   - Schedule consistent therapy or coaching to process chronic stressors.
   - Introduce play: weekly activity purely for joy to balance responsibility load.

2. Organizational Influence
   - Lead by modeling micro-breaks, transparent calendars, and bottom-up feedback loops.
   - Create team “Stress Radar”: monthly check-ins rating workload, clarity, support. Use aggregated data to adjust processes.

TOOLS & TEMPLATES
1. Stress OS Dashboard
   - Track inputs (stressors), outputs (symptoms), interventions, recovery metrics.

2. Somatic Toolkit Cards
   - Printable prompts for breath, movement, grounding techniques to leave on desk.

3. Support Network Map
   - Identify people for venting, problem solving, encouragement, accountability. Note contact cadence.

4. Recovery Menu
   - 5-minute, 15-minute, 60-minute options to reset (stretch, walk, bath, creative time). Keep accessible for quick selection.

CASE STUDIES
Case 1: Operations manager in high-growth startup
   - Implemented 3x daily micro-breaks, set meeting-free mornings, used weekly stress radar.
   - Reported 30% reduction in perceived stress, HRV increased by 12 points.

Case 2: Remote team lead in different time zones
   - Established clear boundaries via shared team charter (response hours, escalation paths).
   - Added virtual co-regulation sessions (guided breathing). Team engagement scores rose.

Case 3: Caregiver balancing full-time work
   - Designed support map including backup childcare, meal prep services.
   - Adopted daily 10-minute somatic release and weekly therapy. Sleep improved and burnout risk decreased.

Remember: Stress is neutral energy. When you map it, move it through, and integrate it daily, you transform chronic tension into a resilient nervous system capable of navigating intense seasons without burnout.`,
    tags: [
      "stress_management",
      "resilience",
      "mental_health",
      "nervous_system",
      "burnout_prevention"
    ]
  },
  {
    source: "health_enhanced",
    category: "exercise_habits",
    title: "Movement Masterplan: Building Exercise Habits That Survive Busy Schedules",
    content: `Exercise habits endure when you design them around identity, environment, and progressive overload—not sheer willpower. This masterplan helps you craft a periodized movement routine with backup options for hectic weeks, scripts for negotiating support, and tracking that celebrates consistency over perfection.

MISSION SNAPSHOT
Objective: Achieve minimum 150 minutes of moderate or 90 minutes of vigorous activity weekly, integrate strength, mobility, and cardio, and maintain streaks even during travel or crunch periods.
Components: Movement Identity Blueprint, 12-Week Training Blocks, Habit Stacking Scripts, Accountability Pods, Recovery Strategy.

PHASE 1: DEFINE MOVEMENT IDENTITY
1. Identity Statements
   - “I am a person who moves daily to generate energy.”
   - “Training is how I future-proof my body and mind.”
   - Write identity on habit tracker, revisit daily.

2. Movement Preference Audit
   - List activities you enjoy (strength training, boxing, yoga, hiking, dance). Rate energy gain vs. drain.
   - Identify constraints (time, equipment, injuries). Choose primary and secondary modalities.

3. Goal Setting (SMART + Meaningful)
   - Example goals: Deadlift 1.5× bodyweight, complete 10K race, maintain pain-free mobility, lower resting heart rate to 60 bpm.
   - Align with deeper why: “Strong to play with kids”, “Confident public presence”, “Longevity.”

PHASE 2: PROGRAM DESIGN
1. Weekly Structure Templates
   - Balanced Template: 3 strength (45 minutes), 2 cardio (30 minutes), 1 mobility session (20 minutes).
   - Minimum Viable Template (busy weeks): 3 sessions × 20 minutes (combination strength + cardio). Use EMOM or AMRAP workouts.

2. 12-Week Periodization
   - Weeks 1-4 Foundation: prioritize form, tempo control, moderate intensity.
   - Weeks 5-8 Progression: increase load or duration by 5-10% weekly.
   - Weeks 9-12 Peak & Deload: push new benchmarks weeks 9-10, deload week 11 (reduce volume 40%), reassess week 12.

3. Habit Stacking
   - Morning mover: lay out clothes night before, queue playlist, put water bottle by door.
   - Lunch break warrior: block calendar, prep quick post-workout meal.
   - Evening athlete: pair with commute home, switch to athletic shoes immediately.

4. Tracking Tools
   - Movement Log template: Date, Session Type, Duration, Intensity, Mood pre/post, Notes.
   - Visual progress board (e.g., 90-day grid) to mark completion—celebrate streaks over perfect metrics.

PHASE 3: SUPPORT & ACCOUNTABILITY
1. Social Structures
   - Accountability pods: 3-5 people check-in daily via group chat.
   - Body doubling: virtual workout sessions over video.
   - Hire coach or join class for periodized plans and technique feedback.

2. Negotiation Scripts
   - Partner support: “Training keeps me energized. Can we swap morning routines twice a week so I can hit the gym?”
   - Manager conversation: “Blocking 12-1 PM twice weekly for workouts helps me show up sharper. Can we protect that time and adjust meetings accordingly?”

3. Rewards & Reflection
   - Weekly debrief: “What moved well? What needs adjustment?”
   - Monthly reward for consistency (new gear, massage).

PHASE 4: TROUBLESHOOTING
Issue: Travel disrupts routine.
   - Solution: Pack resistance bands, pre-plan hotel gym workouts, schedule bodyweight circuits (20-minute EMOM), maintain movement via walking meetings.

Issue: Injury or pain flare.
   - Solution: Consult physiotherapist, modify movement pattern, focus on rehab exercises, maintain upper/lower split depending on injury.

Issue: Motivation dips.
   - Solution: Switch modality temporarily, join challenge, revisit why statement, reduce volume but keep consistency (even 10-minute walks count).

Issue: Time scarcity.
   - Solution: Inject micro-movements (5-minute mobility every 90 minutes), commute via bike, use “exercise snacks” (stairs, quick squats).

Issue: Plateau in performance.
   - Solution: Introduce progressive overload (add weight, reps, tempo), hire coach for technique tweaks, adjust nutrition/sleep.

PHASE 5: RECOVERY & NUTRITION ALIGNMENT
1. Recovery Rituals
   - Post-workout: protein + carbs within 60 minutes, hydration.
   - Sleep priority: 7-9 hours enhances adaptation.
   - Active recovery: light movement, foam rolling, mobility flows.

2. Nutritional Support
   - Ensure adequate protein (1.6-2.2 g/kg), balanced macros, electrolytes during intense sessions.
   - Supplements (consult professional): creatine monohydrate, omega-3, vitamin D.

3. Mindset Integration
   - Link movement to identity: “When I train, I anchor my day in self-respect.”
   - Use visualizations before big efforts.

CASE STUDIES
Case 1: Senior manager with unpredictable hours
   - Adopted Minimum Viable Template (20-minute kettlebell complexes), scheduled 2 weekend longer sessions.
   - Created accountability pod with peers. Maintained streak 10 weeks, reported higher focus.

Case 2: Remote worker experiencing stiffness
   - Integrated hourly mobility micro-breaks, weekly yoga, biweekly strength training.
   - Back pain decreased, posture improved, energy stabilized.

Case 3: Marathon aspirant
   - Periodized plan with cross-training, added strength twice weekly, prioritized sleep.
   - Completed race injury-free, recorded personal best.

Remember: Exercise habits stick when they honor your identity and lifestyle. Prioritize consistency over intensity, celebrate streaks, and build an environment that makes the active choice the easiest choice every day.`,
    tags: [
      "fitness",
      "habit_building",
      "movement",
      "exercise",
      "performance"
    ]
  },
  {
    source: "health_enhanced",
    category: "nutrition_basics",
    title: "Precision Nutrition Playbook: Fueling Energy, Focus, and Longevity",
    content: `Nutrition success is about building systems that make nourishing choices automatic. This playbook guides you through macro planning, meal design, supplementation strategy, and troubleshooting for social events, travel, and busy schedules. You’ll walk away with templates to meal prep in 60 minutes, scripts for boundary setting, and tracking tools that celebrate progress without obsession.

MISSION SNAPSHOT
Objective: Maintain balanced nutrition aligned with goals (e.g., muscle gain, weight stability, metabolic health) while keeping satiety high and decision fatigue low.
Components: Macro Compass, Meal Planning Matrix, Shopping Automation, Eating Environment Audit, Stress-Eating Emergency Kit.

PHASE 1: SET YOUR NUTRITION BASELINE
1. Assess Current Intake
   - Track food for 5-7 days using app or manual log. Note energy levels, digestion, cravings, mood.
   - Calculate maintenance calories using TDEE calculator, adjust for activity.

2. Define Goals
   - Body composition: maintain, muscle gain (+250-300 calories), fat loss (-300-400 calories).
   - Performance: align carbs with training days, ensure protein at each meal.
   - Health markers: monitor bloodwork (lipids, glucose), align fiber intake 25-35 g/day.

3. Macro Compass (starting point)
   - Protein: 0.7-1 g per pound body weight.
   - Fat: 25-35% of total calories.
   - Carbs: remainder, adjusted for activity. Use Carb Cycling for training vs. rest days if helpful.

PHASE 2: MEAL DESIGN & PREP
1. Meal Planning Matrix
   - Build 3 go-to breakfast, lunch, dinner, snack templates.
   - Example: Breakfast (Protein + Fiber + Healthy Fat) smoothie; Lunch (Lean protein + complex carbs + rainbow veggies); Dinner (Slow-cooked protein + roasted veg + whole grains).
   - Use “Flavor Profiles” to avoid monotony (Mediterranean, Asian-inspired, Latin flavors).

2. Batch Prep System (Sunday or preferred day)
   - 60-minute plan: roast sheet pan veggies, cook grain (quinoa, rice), grill/bake protein, wash produce, portion sauces/dressings.
   - Storage strategy: glass containers, label with date, stack by meal component.

3. Grocery Automation
   - Create recurring shopping list (proteins, produce, pantry staples). Use delivery or pick-up to save time.
   - Apply “2-for-1 rule”: when you buy frequently used item, reorder within app to maintain stock.

4. Eating Environment Audit
   - Countertops clear of trigger foods; visible bowls for fruit, hydration reminders.
   - Create “snack zones” with portioned nuts, Greek yogurt, veggies with hummus.

PHASE 3: DAILY NUTRITION RHYTHMS
1. Meal Timing
   - Consistent meal windows to stabilize blood sugar.
   - Pre-workout: protein + carb 60-90 minutes prior.
   - Post-workout: protein + carb for recovery.

2. Hydration Protocol
   - Baseline: body weight (lbs) × 0.6 = daily ounces.
   - Add electrolytes during intense training or hot climates.
   - Morning ritual: 16 oz water with pinch of salt and lemon.

3. Mindful Eating Scripts
   - Pre-meal check-in: “What is my body asking for (energy, comfort, distraction)?”
   - 20-minute meal pace: utensils down between bites, focus on flavor, texture.

PHASE 4: TROUBLESHOOTING
Issue: Stress or emotional eating.
   - Solution: deploy Stress-Eating Emergency Kit—list of non-food coping strategies (drive, walk, journaling, friend call). Use HALT check (Hungry, Angry, Lonely, Tired).

Issue: Social events derail plan.
   - Solution: Pre-eat light protein snack, set intention, choose 1-2 indulgences mindfully, hydrate, resume plan next meal without guilt.

Issue: Travel & dining out.
   - Solution: Research menus, opt for protein-forward meals, request modifications politely (“Can I have dressing on the side?”). Pack portable staples (protein powder, nuts, jerky).

Issue: Digestive discomfort.
   - Solution: Track triggers (dairy, high FODMAP). Introduce elimination test with dietitian guidance. Increase fiber gradually, support gut health with fermented foods.

Issue: Low energy slump.
   - Solution: Assess carb timing, ensure breakfast includes protein, check sleep and hydration.

PHASE 5: SUPPORT & ACCOUNTABILITY
1. Check-In Rhythm
   - Weekly review: track progress markers (measurements, how clothes fit, energy). Avoid scale-only focus.
   - Monthly adjustment: recalibrate calories/macros if plateauing.

2. Communication Scripts
   - Family: “I’m experimenting with a new meal plan for energy. Can we add one new recipe together each week?”
   - Colleagues: “Lunch is my recharge window. I’ll be stepping out to eat mindfully away from my desk.”

3. Professional Allies
   - Engage dietitian/nutrition coach for complex goals (medical conditions, performance).
   - Join community challenges for accountability.

TOOLS & TEMPLATES
1. Nutrition Dashboard
   - Tabs: Meal Planner, Grocery List, Macro Calculator, Habit Tracker, Notes & Reflections.

2. Recipe Bank
   - Categorize recipes by macro balance, prep time, cuisine.

3. Supplement Plan (verify with professional)
   - Omega-3, vitamin D3, probiotic, multivitamin if dietary gaps.

CASE STUDIES
Case 1: Busy executive with afternoon crashes
   - Introduced protein-rich breakfast, swapped sugary snacks for balanced options, hydrated consistently.
   - Afternoon energy stabilized, weight maintained, improved focus.

Case 2: Weight loss plateau
   - Adjusted macros (slightly lower calories), increased NEAT (steps), focused on strength training.
   - Broke plateau, regained momentum.

Case 3: Vegan athlete
   - Increased protein via legumes, tofu, tempeh, supplemented B12, iron.
   - Improved recovery, maintained lean mass.

Remember: Precise nutrition is built on systems. When smart defaults, accessible prep, and compassionate accountability are in place, nourishing choices become automatic—even during the busiest weeks.`,
    tags: [
      "nutrition",
      "meal_planning",
      "healthy_eating",
      "habit_design",
      "energy_management"
    ]
  },
  {
    source: "health_enhanced",
    category: "mental_health_awareness",
    title: "Mental Health Advocacy Toolkit: Recognize, Respond, and Sustain Support",
    content: `Mental health is a collective responsibility. This toolkit equips you to recognize early warning signs, initiate supportive conversations, navigate professional resources, and build ongoing resilience—whether for yourself, a teammate, or a loved one.

MISSION SNAPSHOT
Objective: Create psychologically safe environments where distress is noticed early, validated compassionately, and connected to appropriate help within 48 hours when needed.
Components: Awareness Checklist, Conversation Scripts, Resource Map, Crisis Protocol, Recovery Maintenance Plan.

PHASE 1: BUILD AWARENESS & LANGUAGE
1. Early Indicators Matrix
   - Physical: chronic fatigue, sleep changes, unexplained aches.
   - Cognitive: difficulty concentrating, persistent negative thoughts.
   - Emotional: irritability, numbness, overwhelm.
   - Behavioral: withdrawal, missed deadlines, substance misuse.
   - Track patterns over two weeks before concluding trend.

2. Bias & Stigma Reflection
   - Journal prompts: “What beliefs did I inherit about mental health?” “How do these impact my willingness to seek support?”
   - Commit to language shift: replace “crazy” with “struggling”, “weak” with “courageous.”

3. Education Sprint
   - Spend 60 minutes reviewing reputable resources (WHO, NAMI, Mental Health First Aid). Note key facts about depression, anxiety, burnout, PTSD.

PHASE 2: SUPPORTIVE CONVERSATIONS
1. Preparation Checklist
   - Choose private setting, allocate uninterrupted time, gather relevant observations.
   - Regulate yourself first; use 2-minute breathing to arrive grounded.

2. Conversation Script (ALEC Model: Ask, Listen, Encourage, Check-in)
   - Ask: “I’ve noticed you’ve seemed quieter and missing deadlines. How have you been feeling?”
   - Listen: hold silence, repeat back what you hear.
   - Encourage Action: “Have you spoken to anyone about this? Would you like help finding resources?”
   - Check-in: schedule follow-up (“I’ll check on you Friday. Anything you need before then?”).

3. Boundaries & Scope
   - Clarify role: supportive peer vs. therapist. Offer to connect with professionals, not replace them.
   - Scripts: “I care about you and want to support, and I’m not equipped to counsel. Let’s call the helpline together.”

PHASE 3: RESOURCE NAVIGATION
1. Resource Map Creation
   - Identify internal supports: HR programs, EAP, mental health days, affinity groups.
   - External: therapists (Psychology Today, Headway), crisis lines (988, local), community clinics, peer support.
   - Document insurance coverage, out-of-pocket costs, telehealth options.

2. Crisis Protocol
   - Signs of immediate risk: talking about suicide, self-harm behaviors, hallucinations, extreme disorientation.
   - Action steps: call emergency services if danger imminent; stay with person; remove lethal means if safe; contact crisis line.

3. Self-Advocacy Scripts
   - Requesting accommodations: “I’m managing a health condition that impacts focus. I’d like to discuss flexible schedule options.”
   - Navigating healthcare: “Can you clarify wait times and alternative providers?”

PHASE 4: SUSTAINING RECOVERY
1. Personal Maintenance Plan
   - Daily anchors: sleep hygiene, movement, nourishing meals, connection.
   - Weekly rituals: therapy, support group, creative outlets.
   - Trigger Response Plan: note early signs of relapse and pre-agreed actions (call therapist, adjust workload).

2. Workplace Strategies
   - Implement regular mental health check-ins in teams (“Traffic light” system: green/amber/red).
   - Offer asynchronous updates to reduce meeting fatigue.
   - Encourage leadership vulnerability: share mental health journeys responsibly.

3. Family & Community Support
   - Family meeting to discuss boundaries, support roles, emergency plan.
   - Create support rotation to prevent caregiver burnout.

TOOLS & TEMPLATES
1. Mental Health Action Plan (similar to WRAP)
   - Daily maintenance, triggers, early warning signs, crisis signs, support contacts, treatment preferences.

2. Conversation Tracker
   - Log check-ins: date, observations, commitments made, follow-up date.

3. Resource Directory Sheet
   - Contact info, cost, availability, notes on specialties.

4. Self-Care Inventory
   - 5-minute, 30-minute, 2-hour activities to restore mental state.

CASE STUDIES
Case 1: Team lead noticing burnout signs
   - Used ALEC script, connected employee to EAP, redistributed workload, implemented meeting-free afternoons once per week.
   - Employee recovered, reported feeling supported, retention preserved.

Case 2: Friend struggling silently
   - Observed isolation, gently initiated conversation, accompanied friend to first therapy session, set weekly check-ins.
   - Friend entered treatment, regained stability.

Case 3: Self-advocacy post-burnout
   - Took structured leave, engaged therapist, redesigned schedule with focus blocks, instituted tech-free weekends.
   - Achieved sustainable performance without relapse over six months.

Remember: Mental health thrives in communities that notice, normalize, and support. Your willingness to ask, listen, and guide people toward help can change outcomes—and creates cultures where wellbeing is the norm, not an exception.`,
    tags: [
      "mental_health",
      "psychological_safety",
      "wellbeing",
      "support_systems",
      "advocacy"
    ]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of HEALTH_SCENARIOS_ENHANCED) {
      try {
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, toKnowledgeEmbeddingArgs(scenario));

        loaded++;
        results.push({ title: scenario.title, success: true });
      } catch (error) {
        errors++;
        results.push({
          title: scenario.title,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      loaded,
      errors,
      total: HEALTH_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
