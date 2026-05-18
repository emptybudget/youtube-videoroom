export function extractPlaylistId(url) {
  try {
    const u = new URL(url)
    return u.searchParams.get('list')
  } catch {
    const match = url.match(/[?&]list=([^&]+)/)
    return match ? match[1] : null
  }
}

export async function fetchPlaylistItems(apiKey, playlistId) {
  const items = []
  let pageToken = ''

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    url.searchParams.set('part', 'snippet,contentDetails')
    url.searchParams.set('playlistId', playlistId)
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('key', apiKey)
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || 'API 오류')
    }
    const data = await res.json()
    for (const item of data.items) {
      if (item.snippet.title === 'Deleted video' || item.snippet.title === 'Private video') continue
      items.push({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.videoOwnerChannelTitle,
        position: item.snippet.position,
      })
    }
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return items
}

export async function fetchComments(apiKey, videoId) {
  const url = new URL('https://www.googleapis.com/youtube/v3/commentThreads')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('videoId', videoId)
  url.searchParams.set('maxResults', '100')
  url.searchParams.set('order', 'relevance')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()

  const comments = []
  for (const thread of data.items || []) {
    const c = thread.snippet.topLevelComment.snippet
    const timestamps = parseTimestamps(c.textDisplay)
    if (timestamps.length > 0) {
      comments.push({
        id: thread.id,
        text: c.textDisplay.replace(/<[^>]+>/g, ''),
        authorName: c.authorDisplayName,
        authorPhoto: c.authorProfileImageUrl,
        likeCount: c.likeCount,
        timestamps,
      })
    }
  }
  return comments
}

export function parseTimestamps(text) {
  const plain = text.replace(/<[^>]+>/g, '')
  const regex = /(?:(\d+):)?(\d{1,2}):(\d{2})/g
  const results = []
  let m
  while ((m = regex.exec(plain)) !== null) {
    const h = parseInt(m[1] || 0)
    const min = parseInt(m[2])
    const sec = parseInt(m[3])
    if (min < 60 && sec < 60) {
      results.push(h * 3600 + min * 60 + sec)
    }
  }
  return [...new Set(results)]
}
