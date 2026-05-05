// Emergency protocol data for LifeAR

export const EMERGENCY_PROTOCOLS = {
  cpr: {
    title: 'Cardiopulmonary Resuscitation (CPR)',
    steps: [
      { id: 1, action: 'Check scene safety', detail: 'Make sure the area is safe for you and the victim.' },
      { id: 2, action: 'Check responsiveness', detail: 'Tap shoulders and shout "Are you okay?"' },
      { id: 3, action: 'Call 119', detail: 'If no response, call emergency services immediately.' },
      { id: 4, action: 'Check breathing', detail: 'Look, listen, and feel for breathing for no more than 10 seconds.' },
      { id: 5, action: 'Begin compressions', detail: 'Push hard and fast in the center of the chest, 2 inches deep, 110/min.' },
      { id: 6, action: 'Rescue breaths', detail: 'After 30 compressions, give 2 rescue breaths. Repeat cycle.' },
    ],
    warnings: ['Do not stop unless victim responds, AED arrives, or EMS takes over.', 'Minimize interruptions to compressions.'],
  },
  choking: {
    title: 'Choking (Severe Airway Obstruction)',
    steps: [
      { id: 1, action: 'Ask if choking', detail: 'If person cannot speak, cough, or breathe, proceed.' },
      { id: 2, action: 'Get consent', detail: 'Tell them you are going to help.' },
      { id: 3, action: 'Position yourself', detail: 'Stand behind the person, wrap arms around their waist.' },
      { id: 4, action: 'Make a fist', detail: 'Place thumb side of fist against the middle of abdomen, above the navel.' },
      { id: 5, action: 'Perform thrusts', detail: 'Grasp fist with other hand and thrust inward and upward sharply.' },
      { id: 6, action: 'Repeat', detail: 'Continue until object is expelled or person becomes unconscious.' },
    ],
    warnings: ['If person becomes unconscious, begin CPR.', 'For infants, use back slaps and chest thrusts.'],
  },
  bleeding: {
    title: 'Severe Bleeding Control',
    steps: [
      { id: 1, action: 'Ensure safety', detail: 'Wear gloves if available. Protect yourself from blood.' },
      { id: 2, action: 'Apply direct pressure', detail: 'Use clean cloth or gauze. Press firmly on the wound.' },
      { id: 3, action: 'Elevate wound', detail: 'Raise the injured area above heart level if possible.' },
      { id: 4, action: 'Maintain pressure', detail: 'Hold for 10-15 minutes. Do not check wound early.' },
      { id: 5, action: 'Apply tourniquet', detail: 'If bleeding is life-threatening, apply tourniquet 2-3 inches above wound.' },
      { id: 6, action: 'Note time', detail: 'Write down the time tourniquet was applied.' },
    ],
    warnings: ['Never remove a tourniquet once applied.', 'Seek medical help immediately.'],
  },
  burns: {
    title: 'Burn Treatment',
    steps: [
      { id: 1, action: 'Remove from source', detail: 'Move person away from heat source. Stop the burning.' },
      { id: 2, action: 'Cool the burn', detail: 'Run cool (not cold) water over burn for 10-20 minutes.' },
      { id: 3, action: 'Remove items', detail: 'Gently remove jewelry, watches, or loose clothing near burn.' },
      { id: 4, action: 'Do not apply', detail: 'No ice, butter, ointments, or creams on severe burns.' },
      { id: 5, action: 'Cover loosely', detail: 'Use sterile non-stick dressing or clean cloth.' },
      { id: 6, action: 'Seek help', detail: 'Call 119 for severe burns (large area, face, hands, genitals).' },
    ],
    warnings: ['Do not break blisters.', 'For chemical burns, flush with water for 20+ minutes.'],
  },
};

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EMERGENCY_NUMBERS = {
  korea: { police: '112', fire_ambulance: '119', sea_rescue: '122' },
  general: { police: '112', ambulance: '119', fire: '119' },
};