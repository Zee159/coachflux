/**
 * Health & Wellness Knowledge Base - 5 Scenarios
 * 
 * Run this to load scenarios:
 *   npx convex run seedHealth:seed
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

const HEALTH_SCENARIOS = [
  {
    source: "health_wellness",
    category: "sleep",
    title: "Optimizing Sleep Quality",
    content: `How to get better sleep:

Sleep Requirements:
- Adults: 7-9 hours
- Quality matters as much as quantity

Benefits:
- Better focus and productivity
- Stronger immune system
- Improved mood
- Better decision-making
- Weight management

The Sleep Hygiene Checklist:

1. Consistent Schedule
- Same bedtime and wake time daily
- Even on weekends
- Trains circadian rhythm

2. Bedroom Environment
- Cool (65-68°F / 18-20°C)
- Dark (blackout curtains)
- Quiet (white noise if needed)
- Comfortable mattress

3. Pre-Sleep Routine (1 hour before)
- Dim lights
- No screens (blue light disrupts melatonin)
- Relaxing activities (reading, stretching)
- Warm bath or shower

4. Daytime Habits
- Morning sunlight (15-30 min)
- Regular exercise (not 3 hours before bed)
- Limit caffeine after 2pm
- Avoid large meals before bed

5. What to Avoid
❌ Alcohol (disrupts sleep cycles)
❌ Nicotine (stimulant)
❌ Late-day naps (>30 min or after 3pm)
❌ Clock-watching (increases anxiety)

The 4-7-8 Breathing:

For falling asleep:
1. Inhale through nose for 4 counts
2. Hold breath for 7 counts
3. Exhale through mouth for 8 counts
4. Repeat 4 times

If You Can't Sleep:

The 20-Minute Rule:
- If awake 20+ minutes, get up
- Do quiet activity in dim light
- Return to bed when sleepy
- Don't watch clock

When to See Doctor:

- Chronic insomnia (3+ nights/week for 3+ months)
- Excessive daytime sleepiness
- Loud snoring or gasping
- Sleep affecting daily life

Remember: Sleep is essential, not lazy. Prioritize it like nutrition and exercise.`,
    tags: ["sleep", "sleep_hygiene", "rest", "health", "wellness", "circadian_rhythm"]
  },
  {
    source: "health_wellness",
    category: "exercise",
    title: "Building an Exercise Habit",
    content: `How to start and maintain regular exercise:

Minimum Recommendations:
- 150 minutes moderate cardio per week (30 min × 5 days)
- OR 75 minutes vigorous cardio
- PLUS strength training 2× per week

Benefits:
- Improved mood and mental health
- Better sleep quality
- Increased energy
- Weight management
- Reduced disease risk

Starting from Zero:

Week 1-2: Build Habit
- 10 minutes daily
- Any movement counts
- Focus on consistency

Week 3-4: Increase Duration
- 15-20 minutes daily
- Add variety
- Find what you enjoy

Week 5-8: Build Intensity
- 30 minutes most days
- Mix cardio and strength
- Challenge yourself gradually

Types of Exercise:

1. Cardio - Walking, running, cycling, swimming
2. Strength - Bodyweight, resistance bands, weights
3. Flexibility - Stretching, yoga
4. Balance - Tai chi, single-leg exercises

Making It Stick:

1. Schedule It - Treat like important meeting
2. Remove Barriers - Lay out clothes night before
3. Start Small - 5 minutes > 0 minutes
4. Find Enjoyment - Try different activities
5. Track Progress - Log workouts, celebrate milestones

Sample Beginner Week:

Monday: 30-min walk
Tuesday: 20-min strength (bodyweight)
Wednesday: Rest or gentle yoga
Thursday: 30-min walk or bike
Friday: 20-min strength
Saturday: 45-min activity you enjoy
Sunday: Rest or gentle stretching

Overcoming Obstacles:

"I don't have time"
→ 10 minutes is enough to start

"I'm too tired"
→ Exercise increases energy

"I don't know what to do"
→ Start with walking

When to Rest:

- Muscle soreness: Normal, keep moving gently
- Sharp pain: Stop, rest, see doctor
- Exhaustion: Take rest day
- Illness: Rest until recovered

Remember: Movement is medicine. Find what you enjoy and do it consistently.`,
    tags: ["exercise", "fitness", "health", "habits", "physical_activity", "strength_training"]
  },
  {
    source: "health_wellness",
    category: "nutrition",
    title: "Sustainable Healthy Eating",
    content: `How to eat well without dieting:

Principles:

1. Eat Mostly Whole Foods
- Vegetables and fruits
- Whole grains
- Lean proteins
- Healthy fats
- Minimize processed foods

2. Balance Your Plate
- 1/2 vegetables and fruits
- 1/4 lean protein
- 1/4 whole grains
- Healthy fat (olive oil, nuts, avocado)

3. Listen to Your Body
- Eat when hungry
- Stop when satisfied (not stuffed)
- No strict rules

The 80/20 Approach:

80% Nutrient-Dense Foods
20% Flexibility (treats, social occasions)

Simple Meal Formula:

Protein + Vegetable + Carb + Fat = Meal

Examples:
- Chicken + Broccoli + Rice + Olive oil
- Salmon + Salad + Sweet potato + Avocado
- Eggs + Spinach + Toast + Nuts

Healthy Eating Habits:

1. Eat Breakfast - Starts metabolism
2. Stay Hydrated - 8 glasses water daily
3. Mindful Eating - Eat without distractions
4. Regular Meals - Every 3-4 hours
5. Healthy Snacks - Fruit + nuts, vegetables + hummus

Navigating Challenges:

Eating Out:
- Check menu ahead
- Ask for modifications
- Share large portions

Social Events:
- Eat normally before
- Bring healthy dish
- Focus on socializing

Cravings:
- Wait 10 minutes
- Drink water first
- Have small portion

Nutrition Myths:

❌ Carbs are bad → ✅ Whole grains are healthy
❌ Fat makes you fat → ✅ Healthy fats are essential
❌ Skip meals to lose weight → ✅ Regular meals boost metabolism

Building Healthy Relationship:

1. No Food Rules - All foods can fit
2. Ditch Diet Mentality - Sustainable changes only
3. Practice Self-Compassion - One meal doesn't define you
4. Enjoy Food - Cooking can be fun

Remember: Healthy eating is about nourishing your body, not punishing it.`,
    tags: ["nutrition", "healthy_eating", "meal_planning", "diet", "food", "wellness"]
  },
  {
    source: "health_wellness",
    category: "stress",
    title: "Daily Stress Management",
    content: `How to manage stress in everyday life:

Understanding Stress:

Good Stress (Eustress) - Motivates, short-term
Bad Stress (Distress) - Overwhelms, chronic

Daily Practices:

Morning (10 min):
- Meditation or deep breathing
- Gratitude (3 things)
- Set intentions
- Light stretching

During Day:
- Breaks every 90 minutes
- Step outside for air
- Deep breathing
- Stay hydrated

Evening (15 min):
- Exercise or walk
- Disconnect from work
- Relaxing activity
- Prepare for tomorrow

Quick Stress Relief:

1. Box Breathing (2 min)
- Inhale 4, Hold 4, Exhale 4, Hold 4
- Repeat 4 times

2. 5-4-3-2-1 Grounding
- 5 things you see
- 4 things you touch
- 3 things you hear
- 2 things you smell
- 1 thing you taste

3. Progressive Muscle Relaxation
- Tense muscle group 5 seconds
- Release and notice difference
- Move through body

Long-Term Strategies:

1. Regular Exercise - 30 min most days
2. Adequate Sleep - 7-9 hours
3. Healthy Eating - Balanced meals
4. Social Connection - Time with loved ones
5. Hobbies and Fun - Make time for enjoyment

Stress Reduction Techniques:

- Meditation (5 min daily)
- Yoga (movement + breath)
- Journaling (thoughts and feelings)
- Nature Time (20 min outdoors)

Warning Signs:

Physical: Headaches, sleep problems, digestive issues
Emotional: Irritability, anxiety, depression
Behavioral: Changes in appetite, withdrawal

When to Seek Help:

- Stress interfering with daily life
- Using unhealthy coping mechanisms
- Feeling hopeless
- Physical symptoms persisting

Resources:
- Therapist or counselor
- Employee assistance program
- Support groups
- Crisis hotline

Remember: Stress is part of life, but chronic stress is optional.`,
    tags: ["stress_management", "mental_health", "coping", "mindfulness", "self_care", "wellness"]
  },
  {
    source: "health_wellness",
    category: "mental_health",
    title: "Maintaining Mental Health",
    content: `How to support your mental wellbeing:

Mental Health Includes:
- Emotional wellbeing
- Psychological wellbeing
- Social wellbeing

Daily Practices:

1. Morning Mindset (5 min)
- Gratitude (3 things)
- Positive affirmation
- Set intention

2. Movement (30 min)
- Exercise releases endorphins
- Reduces anxiety and depression

3. Connection (15 min)
- Reach out to someone
- Meaningful conversation

4. Mindfulness (10 min)
- Meditation or breathing
- Present moment awareness

5. Evening Reflection (5 min)
- What went well?
- What am I grateful for?

Building Resilience:

1. Self-Awareness - Notice emotions and triggers
2. Self-Care - Physical health basics
3. Healthy Relationships - Supportive connections
4. Purpose - Connect to values
5. Positive Mindset - Challenge negative thoughts

Managing Difficult Emotions:

Anxiety:
- Deep breathing
- Ground in present
- Challenge worried thoughts

Depression:
- Get moving (even 10 min walk)
- Connect with others
- Stick to routine

Anger:
- Take timeout
- Physical activity
- Express in healthy ways

When to Seek Help:

Consider therapy if:
- Persistent sad or anxious mood
- Difficulty functioning daily
- Relationship problems
- Trauma or loss
- Thoughts of self-harm

Types of Professionals:

- Psychiatrist: Medical doctor, can prescribe
- Psychologist: PhD, therapy and testing
- Therapist/Counselor: Master's level, therapy
- Social Worker: MSW, therapy and resources

Supporting Others:

How to Help:
1. Listen Without Judgment
2. Ask Directly ("Are you okay?")
3. Offer Practical Help
4. Take Care of Yourself

What NOT to Say:
❌ "Just think positive"
❌ "Others have it worse"
❌ "Snap out of it"

✅ "I'm here for you"
✅ "That sounds really hard"
✅ "How can I help?"

Crisis Resources:

- National Suicide Prevention: 988
- Crisis Text Line: Text HOME to 741741
- Emergency: 911

Remember: Mental health is just as important as physical health.`,
    tags: ["mental_health", "wellbeing", "therapy", "self_care", "resilience", "emotional_health"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Health & Wellness scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of HEALTH_SCENARIOS) {
      try {
        console.log(`Loading: ${scenario.title}`);
        
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
          source: scenario.source,
          category: scenario.category,
          title: scenario.title,
          content: scenario.content,
          tags: scenario.tags
        });
        
        loaded++;
        console.log(`  ✅ Loaded`);
        
      } catch (error) {
        errors++;
        console.error(`  ❌ Error:`, error);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Loaded: ${loaded}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Total: ${HEALTH_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: HEALTH_SCENARIOS.length
    };
  },
});
