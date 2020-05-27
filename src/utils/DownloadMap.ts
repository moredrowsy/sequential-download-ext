export default class DownloadsMap {
  map: Downloads;

  constructor() {
    this.map = {};
  }

  add(downloads: Downloads) {
    Object.keys(downloads).map((url) => this.addOne(downloads[url]));
  }

  addOne(download: Download) {
    this.map[download.url] = download;
  }

  removeOne(download: Download) {
    if (download.url in this.map) delete this.map[download.url];
  }

  clear() {
    this.map = {};
  }

  keys(): string[] {
    return Object.keys(this.map);
  }

  has(url: string): boolean {
    return url in this.map;
  }

  get(url: string): Download | undefined {
    return this.map[url];
  }

  getMap(): Downloads {
    return this.map;
  }

  setState(url: string, state: DownloadState) {
    if (url in this.map) this.map[url].state = state;
  }

  getState(url: string): DownloadState | undefined {
    return url in this.map ? this.map[url].state : undefined;
  }

  setId(url: string, id: number) {
    if (url in this.map) this.map[url].id = id;
  }

  getId(url: string): number | undefined {
    return url in this.map ? this.map[url].id : undefined;
  }
}
