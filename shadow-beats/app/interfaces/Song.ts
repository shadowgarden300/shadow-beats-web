import { SearchItem } from "./SearchItem";


export interface SongItem {
    id:string,
    thumbnail:string,
    title:string,
    playListId:string
}

export interface SongData{
    songItem : SongItem,
    songStream:StreamData
}

interface Thumbnail{
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
}

function resolveUrl (thumbnails:Thumbnail):string{
    if (thumbnails.maxres) return thumbnails.maxres.url;
    else if (thumbnails.high) return thumbnails.high.url;
    else if (thumbnails.medium) return thumbnails.medium.url;
    else if (thumbnails.standard) return thumbnails.standard.url;
    else if (thumbnails.default) return thumbnails.default.url;
    else return "/not-found.jpeg"
}
export function convertSearchItemsToSongs(searchItems:SearchItem[]):SongItem[]{
    return searchItems.map((searchItem) => {
        const { id, snippet } = searchItem;
    
        return {
          id: id.videoId,
          title:snippet.title,
          thumbnail:resolveUrl(snippet.thumbnails),
          playListId:'recomendations'
        };
      });
}

export function convertPlayListItemsToSongs(searchItems:PlaylistItem[]):SongItem[]{
    return searchItems.map((searchItem) => {
        const { snippet } = searchItem;
    
        return {
          id: snippet.resourceId.videoId,
          title:snippet.title,
          thumbnail:resolveUrl(snippet.thumbnails),
          playListId: snippet.playlistId
        };

      });
}