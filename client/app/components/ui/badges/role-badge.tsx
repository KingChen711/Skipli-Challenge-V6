import { ERole } from '~/types/models'
import { Badge } from '../badge'

type Props = {
  status: ERole
}

const getTypeColor = (type: ERole) => {
  switch (type) {
    case ERole.INSTRUCTOR:
      return 'default'
    case ERole.STUDENT:
      return 'secondary'

    default:
      return 'default'
  }
}

function RoleBadge({ status }: Props) {
  return (
    <Badge variant={getTypeColor(status)} className='flex w-20 shrink-0 justify-center font-bold'>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default RoleBadge
