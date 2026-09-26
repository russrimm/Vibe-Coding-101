import type { Industry } from '../../types/industry'
import { curriculumModules } from '../../data/curriculum'
import { sitePageHref } from '../../hooks/useSitePage'
import { followLessonLink } from '../../lib/readerNavigation'
import CurriculumStage, { stageButtonClass } from './CurriculumStage'

interface CompletionStepProps {
  industry: Industry
  onReset: () => void
  onPrevious: () => void
  onWhatsNext: () => void
  stepNumber: number
  totalSteps: number
}

export default function CompletionStep({
  industry,
  onReset,
  onPrevious,
  onWhatsNext,
  stepNumber,
  totalSteps,
}: CompletionStepProps) {
  return (
    <CurriculumStage
      industry={industry}
      content={curriculumModules.completion}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <button type="button" onClick={onPrevious} className={stageButtonClass}>
        Review testing checks
      </button>
      <button type="button" onClick={onWhatsNext} className={stageButtonClass}>
        Explore optional next steps
      </button>
      <button type="button" onClick={onReset} className={stageButtonClass}>
        Choose another use case
      </button>
      <a
        href={sitePageHref('coaching')}
        onClick={followLessonLink}
        className={stageButtonClass}
      >
        Book 1:1 training
      </a>
    </CurriculumStage>
  )
}
