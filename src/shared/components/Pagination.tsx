import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation('auth')

  const handlePrev = () => {
    if (currentPage > 0) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('history.prev')}
      </button>

      <div className="flex items-center gap-1">
        {Array.from(
          { length: Math.min(5, totalPages) },
          (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i
            } else if (currentPage < 2) {
              pageNum = i
            } else if (currentPage > totalPages - 3) {
              pageNum = totalPages - 5 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            const isCurrent = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted/50'
                }`}
              >
                {pageNum + 1}
              </button>
            )
          }
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('history.next')}
      </button>
    </div>
  )
}
