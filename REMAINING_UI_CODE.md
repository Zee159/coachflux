# Remaining UI Code - SessionView.tsx

## ✅ COMPLETED SO FAR
- Imports added ✅
- State detection added ✅
- Helper functions added ✅

## 🚧 REMAINING: Add UI Rendering

### 1. Find the Reflection Rendering Loop

Search for: `reflections?.map((reflection, idx)`

This is where each reflection is rendered. You need to add the confirmation buttons AFTER the reflection display, INSIDE the map loop.

### 2. Add Step Confirmation Buttons

**Location:** Inside the `reflections?.map()` loop, after the reflection content is displayed

**Add this code:**
```tsx
{/* Step Confirmation Buttons */}
{awaitingConfirmation && isLastReflection && !isSessionComplete && (
  <StepConfirmationButtons
    stepName={reflection.step}
    nextStepName={getNextStepName(reflection.step)}
    onProceed={() => {
      void nextStepAction({
        orgId: session.orgId,
        userId: session.userId,
        sessionId: session._id,
        stepName: reflection.step,
        userTurn: '',
        structuredInput: {
          type: 'step_confirmation',
          data: { action: 'proceed' }
        }
      });
    }}
    onAmend={() => {
      void nextStepAction({
        orgId: session.orgId,
        userId: session.userId,
        sessionId: session._id,
        stepName: reflection.step,
        userTurn: '',
        structuredInput: {
          type: 'step_confirmation',
          data: { action: 'amend' }
        }
      });
    }}
    isLoading={submitting}
  />
)}
```

### 3. Replace Review Step "Show Report" Button

**Location:** Search for the existing "Show Report" button in the review step

**Replace with:**
```tsx
{reflection.step === 'review' && isLastReflection && !isSessionComplete && (
  <div className="flex gap-3 my-4">
    <button
      onClick={() => triggerReportGeneration()}
      disabled={submitting}
      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
    >
      Show Report
    </button>
    <button
      onClick={() => setShowStepSelector(true)}
      disabled={submitting}
      className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:border-gray-400 disabled:text-gray-400 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
    >
      Amend a Step
    </button>
  </div>
)}
```

### 4. Add Amendment Modal

**Location:** At the END of the component's return statement, BEFORE the closing `</div>` of the main container

**Add this code:**
```tsx
{/* Amendment Modal */}
{amendmentMode?.active && reflections !== undefined && (
  <AmendmentModal
    stepName={amendmentMode.step}
    fields={extractFieldsForAmendment(amendmentMode.step, reflections)}
    onSave={(amendments) => {
      void nextStepAction({
        orgId: session.orgId,
        userId: session.userId,
        sessionId: session._id,
        stepName: amendmentMode.step,
        userTurn: '',
        structuredInput: {
          type: 'amendment_complete',
          data: { action: 'save', amendments }
        }
      });
    }}
    onCancel={() => {
      void nextStepAction({
        orgId: session.orgId,
        userId: session.userId,
        sessionId: session._id,
        stepName: amendmentMode.step,
        userTurn: '',
        structuredInput: {
          type: 'amendment_complete',
          data: { action: 'cancel' }
        }
      });
    }}
    isLoading={submitting}
  />
)}
```

### 5. Add Step Selector Modal

**Location:** Right after the Amendment Modal code

**Add this code:**
```tsx
{/* Step Selector Modal for Review */}
{showStepSelector && session !== undefined && session !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Select Step to Amend
      </h3>
      <div className="space-y-2">
        {getStepsForFramework(session.framework).map(step => (
          <button
            key={step}
            onClick={() => {
              setShowStepSelector(false);
              void nextStepAction({
                orgId: session.orgId,
                userId: session.userId,
                sessionId: session._id,
                stepName: 'review',
                userTurn: '',
                structuredInput: {
                  type: 'review_amendment_selection',
                  data: { step }
                }
              });
            }}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-900 dark:text-gray-100 rounded-lg text-left font-medium transition-colors"
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowStepSelector(false)}
        className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
)}
```

## 📍 EXACT LOCATIONS TO FIND

1. **For Step Confirmation Buttons:**
   - Search for: `{formatReflectionDisplay(reflection.step, reflection.payload)}`
   - Add the confirmation buttons code RIGHT AFTER this line

2. **For Review Step Buttons:**
   - Search for: `reflection.step === 'review'` and find the existing button
   - Replace the single button with the two-button layout

3. **For Amendment Modal:**
   - Scroll to the very end of the return statement
   - Find the last `</div>` before the component closes
   - Add the Amendment Modal code BEFORE that closing div

4. **For Step Selector Modal:**
   - Add RIGHT AFTER the Amendment Modal code

## ✅ VERIFICATION

After adding all code:
1. No TypeScript errors
2. All unused variable warnings should disappear
3. Component should compile successfully
4. Test by running the app and starting a session

## 🎯 EXPECTED BEHAVIOR

1. Complete Goal step → See "Proceed to Reality" and "Amend Response" buttons
2. Click "Amend Response" → Modal opens with goal fields
3. Edit a field → Click "Save" → Returns to confirmation buttons
4. Click "Proceed to Reality" → Advances to Reality step
5. Complete Review step → See "Show Report" and "Amend a Step" buttons
6. Click "Amend a Step" → Step selector modal opens
7. Select "Goal" → Amendment modal opens with goal fields
8. Click "Save" or "Cancel" → Report generates automatically

---

**Status:** All backend complete, helper functions added, just need to add 5 UI rendering blocks above.
