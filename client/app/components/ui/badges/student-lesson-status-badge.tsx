import { EStudentLessonStatus } from '~/types/models'
import { Badge } from '../badge'

type Props = {
  status: EStudentLessonStatus
}

const getTypeColor = (type: EStudentLessonStatus) => {
  switch (type) {
    case EStudentLessonStatus.COMPLETED:
      return 'success'
    case EStudentLessonStatus.PENDING:
      return 'warning'

    default:
      return 'default'
  }
}

function LessonStatusBadge({ status }: Props) {
  return (
    <Badge variant={getTypeColor(status)} className='flex w-20 shrink-0 justify-center font-bold'>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default LessonStatusBadge
