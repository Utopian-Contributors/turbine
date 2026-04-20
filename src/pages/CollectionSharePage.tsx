import { Library, Link2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useCollectionBySlugQuery } from '../../generated/graphql'

const CollectionSharePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data, loading } = useCollectionBySlugQuery({
    variables: { slug: slug ?? '' },
    skip: !slug,
  })

  const collection = data?.collectionBySlug

  useEffect(() => {
    document.title = collection ? `${collection.name} | Utopian` : 'Collection | Utopian'
  }, [collection])

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center apple-page">
        <p className="text-[13px]" style={{ color: 'var(--apple-text-secondary)' }}>
          Loading...
        </p>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center apple-page">
        <div className="text-center">
          <Library className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--apple-text-faint)' }} />
          <p className="text-[13px]" style={{ color: 'var(--apple-text-secondary)' }}>
            Collection not found or is private.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen apple-page">
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-16">
        <div className="rounded-xl p-5 mb-4 apple-panel">
          <h1
            className="text-[22px] font-bold mb-1"
            style={{ color: 'var(--apple-text-primary)' }}
          >
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-[13px]" style={{ color: 'var(--apple-text-secondary)' }}>
              {collection.description}
            </p>
          )}
          <p className="text-[10px] mt-2" style={{ color: 'var(--apple-text-muted)' }}>
            {collection.items.length} URL{collection.items.length !== 1 ? 's' : ''}
          </p>
        </div>

        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--apple-text-muted)' }}
        >
          URLs
        </p>
        <div className="flex flex-col gap-1">
          {collection.items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl apple-panel-soft apple-list-item"
            >
              <Link2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--apple-text-muted)' }} />
              <div className="flex-1 min-w-0">
                {item.title && (
                  <p className="text-[12px] font-medium truncate" style={{ color: 'var(--apple-text-primary)' }}>
                    {item.title}
                  </p>
                )}
                <p
                  className="text-[11px] font-mono truncate"
                  style={{ color: item.title ? 'var(--apple-text-muted)' : 'var(--apple-text-primary)' }}
                >
                  {item.url}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollectionSharePage
