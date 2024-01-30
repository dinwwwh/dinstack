import { getOramaDB, search } from '@orama/plugin-astro/client'
import { Button } from '@web/components/ui/button'
import { CommandDialog, CommandInput, CommandItem, CommandList } from '@web/components/ui/command'
import { cn } from '@web/lib/utils'
import { SearchIcon, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useKeyPressEvent, useDebounce } from 'react-use'

type Hit = {
  document: {
    path: string
    title: string
    content: string
  }
  id: string
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')

  useKeyPressEvent('/', () => setOpen(true))

  useDebounce(
    async () => {
      if (!term) return

      try {
        setLoading((v) => v + 1)
        const db = await getOramaDB('content')
        const results = await search(db, { term })

        await new Promise((resolve) => setTimeout(resolve, 2_000))

        setHits(results.hits as unknown as Hit[])
      } finally {
        setLoading((v) => v - 1)
      }
    },
    500,
    [term],
  )

  const [loading, setLoading] = useState(0)
  const [hits, setHits] = useState<Hit[]>([])

  return (
    <>
      <Button
        type="button"
        size={'sm'}
        variant={'ghost'}
        onClick={() => setOpen((v) => !v)}
        className="group"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="size-5 text-muted-foreground group-hover:text-foreground" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} commandProps={{ shouldFilter: false }}>
        <CommandInput
          placeholder="Type to search..."
          value={term}
          onValueChange={(v) => setTerm(v)}
        />
        <CommandList className="max-h-[350px]">
          {loading ? (
            <div className="w-full py-6 flex justify-center">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          ) : hits.length === 0 ? (
            term.length > 0 ? (
              <div className="w-full py-6 flex justify-center">
                <span className="text-muted-foreground text-sm">No results found.</span>
              </div>
            ) : null
          ) : (
            hits.map((hit) => <HitItem key={hit.document.path} hit={hit} />)
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function HitItem({ hit }: { hit: Hit }) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <CommandItem value={hit.document.path} onSelect={() => ref.current?.click()}>
      <a ref={ref} tabIndex={-1} href={hit.document.path} className="flex items-center gap-3">
        <span
          className={cn('px-2 py-1 rounded-md', {
            'text-primary-foreground  bg-primary': hit.document.path.startsWith('/blog'),
            'text-secondary-foreground  bg-secondary': hit.document.path.startsWith('/docs'),
          })}
        >
          {hit.document.path.startsWith('/blog') ? 'Post' : 'Doc'}
        </span>
        <span>{hit.document.title.substring(0, hit.document.title.lastIndexOf('|'))}</span>
      </a>
    </CommandItem>
  )
}
