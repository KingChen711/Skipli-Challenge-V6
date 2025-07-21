import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import { useNavigate, useSearchParams } from 'react-router'

import { Button, buttonVariants } from '../../components/ui/button'
import { cn, formUrlQuery } from '~/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Command, CommandGroup, CommandItem, CommandList } from './command'

const rowsPerPageOptions = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: '100', value: '100' }
] as const

type Props = {
  pageIndex: number
  totalPages: number
  pageSize: number
  totalCount: number
  pageIndexKey?: string
  pageSizeKey?: string
  className?: string
  onPaginate?: (page: number) => void
  onChangePageSize?: (size: '5' | '10' | '30' | '50' | '100') => void
}

function Paginator({
  pageIndex,
  pageSize,
  totalPages,
  totalCount,
  pageIndexKey = 'pageIndex',
  pageSizeKey = 'pageSize',
  className,
  onPaginate,
  onChangePageSize
}: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [open, setOpen] = useState(false)

  const paginate = ({ selected }: { selected: number }) => {
    if (onPaginate) {
      onPaginate(selected + 1)
      return
    }
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        [pageIndexKey]: (selected + 1).toString()
      }
    })

    navigate(newUrl, {
      replace: true,
      preventScrollReset: false
    })
  }

  const handleChangeRowsPerPage = (pageSize: string) => {
    if (onChangePageSize) {
      setOpen(false)
      onChangePageSize(pageSize as '5' | '10' | '30' | '50' | '100')
      if (onPaginate) {
        onPaginate(1)
        return
      }
      return
    }
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        [pageSizeKey]: pageSize,
        [pageIndexKey]: '1'
      }
    })

    setOpen(false)
    navigate(newUrl, { replace: true })
  }

  if (totalPages === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      <div className='flex-1 text-sm text-nowrap'>
        Showing {(pageIndex - 1) * pageSize + 1} to &nbsp;
        {Math.min(pageIndex * pageSize, totalCount || 0)} of &nbsp;
        {totalCount || 0} items
      </div>
      <ReactPaginate
        forcePage={pageIndex - 1}
        onPageChange={paginate}
        pageCount={totalPages}
        breakClassName={buttonVariants({ variant: 'ghost' })}
        containerClassName={cn('flex flex-wrap justify-center gap-2')}
        pageLinkClassName={buttonVariants({ variant: 'nav' })}
        previousLinkClassName={buttonVariants({ variant: 'link' })}
        disabledClassName={'pointer-events-none opacity-50'}
        nextLinkClassName={buttonVariants({ variant: 'link' })}
        activeLinkClassName={buttonVariants()}
        previousLabel={'Trước'}
        nextLabel={'Sau'}
      />
      <div className='flex flex-1 items-center justify-end gap-x-2'>
        <div className='text-sm text-nowrap'>Rows per page</div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size='sm'
              variant='outline'
              role='combobox'
              className={cn('w-[80px] justify-between', !pageSize && 'text-muted-foreground')}
            >
              {pageSize
                ? rowsPerPageOptions.find((language) => language.value === pageSize.toString())?.label
                : 'Select language'}
              <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[80px] p-0'>
            <Command>
              <CommandList>
                <CommandGroup>
                  {rowsPerPageOptions.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => handleChangeRowsPerPage(option.value)}
                      className='cursor-pointer'
                    >
                      {option.label}
                      <Check
                        className={cn('ml-auto', option.value === pageSize.toString() ? 'opacity-100' : 'opacity-0')}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Paginator
