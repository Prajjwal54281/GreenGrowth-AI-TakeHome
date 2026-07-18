import { Link } from 'react-router-dom'
import { PageContainer } from '../components/PageHeader'
import { Button } from '../components/ui/primitives'

export function NotFound() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <div className="text-5xl font-black text-ink-200">404</div>
        <p className="text-sm text-ink-500">That screen doesn’t exist in this prototype.</p>
        <Link to="/">
          <Button>Back to start</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
