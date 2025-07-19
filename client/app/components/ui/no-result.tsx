import NoResultImage from '~/assets/images/no-result.png'

type Props = {
  title: string
  description: string
}

function NoResult({ title, description }: Props) {
  return (
    <div className='flex w-full flex-col items-center justify-center overflow-hidden'>
      <img src={NoResultImage} alt='no result' width={300} height={300} className='block rounded-md object-contain' />

      <h2 className='mt-8 text-[24px] font-bold leading-[30px]'>{title}</h2>
      <p className='my-3 max-w-md text-center text-[14px] font-normal leading-[18px] text-muted-foreground'>
        {description}
      </p>
    </div>
  )
}

export default NoResult
