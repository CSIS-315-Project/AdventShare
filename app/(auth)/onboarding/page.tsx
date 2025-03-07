'use client'

import * as React from 'react'
import { completeOnboarding } from './_actions'
import OnboardingForm from '@/features/auth/components/Onboarding'

export default function OnboardingComponent() {
  return (
    <div>
      <OnboardingForm action={completeOnboarding} />
    </div>
  )
}