export interface SearchItem {
    kind: string; // "youtube#searchResult"
    etag: string;
    id: {
      kind: string; // "youtube#video"
      videoId: string;
    };
    snippet: {
      publishedAt: string; // Date in ISO 8601 format
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      liveBroadcastContent: string; // "none" or other values
      publishTime: string; // Date in ISO 8601 format
    };
  }

export function convertSearchItemsToPlaylistItems(searchItems: SearchItem[]): PlaylistItem[] {
    return searchItems.map((searchItem) => {
      const { id, snippet } = searchItem;
  
      return {
        id: id.videoId, // Use videoId from the SearchItem
        snippet: {
          publishedAt: snippet.publishedAt,
          channelId: snippet.channelId,
          title: snippet.title,
          description: snippet.description,
          thumbnails: snippet.thumbnails,
          channelTitle: snippet.channelTitle,
          playlistId: '', // Placeholder since SearchItem doesn't have playlistId
          position: 0, // Default position; update based on requirements
          resourceId: {
            kind: id.kind,
            videoId: id.videoId,
          },
          videoOwnerChannelTitle: snippet.channelTitle, // Use the channelTitle as video owner
          videoOwnerChannelId: snippet.channelId, // Use channelId as video owner ID
        },
      };
    });
  }
  