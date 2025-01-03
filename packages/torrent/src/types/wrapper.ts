/**
 * Represents the unique identifier of a torrent.
 */
export type TorrentId = {
  /** Numeric unique identifier of the torrent */
  id: number;
  /** Hash of the torrent information */
  info_hash: string;
};

/**
 * Represents a file within a torrent.
 */
export type File = {
  /** Full name of the file */
  name: string;
  /** Path components of the file (used for directory hierarchy) */
  components: string[];
  /** Size of the file in bytes */
  length: number;
  /** Indicates whether the file is included in the download */
  included: boolean;
};

/**
 * Possible states of a torrent.
 */
export enum TorrentState {
  /** Torrent is initializing */
  Initializing = 'initializing',
  /** Torrent is paused */
  Paused = 'paused',
  /** Torrent is active and transferring data */
  Live = 'live',
  /** Torrent encountered an error */
  Error = 'error',
}

/**
 * Possible states of a peer.
 */
export enum PeerState {
  /** Peer is disconnected or inactive */
  Dead = 'dead',
  /** Peer is active and transferring data */
  Live = 'live',
  /** Peer is attempting to establish a connection */
  Connecting = 'connecting',
}

/**
 * Counters and statistics related to a peer.
 */
export type PeerCounters = {
  /** Incoming connections from the peer */
  incoming_connections: number;
  /** Total bytes fetched from the peer */
  fetched_bytes: number;
  /** Total time spent connecting (in milliseconds) */
  total_time_connecting_ms: number;
  /** Number of connection attempts */
  connection_attempts: number;
  /** Total successful connections */
  connections: number;
  /** Total errors encountered */
  errors: number;
  /** Data chunks fetched */
  fetched_chunks: number;
  /** Total pieces downloaded and verified */
  downloaded_and_checked_pieces: number;
  /** Total time spent downloading pieces (in milliseconds) */
  total_piece_download_ms: number;
  /** Number of times the peer stole data from this client */
  times_stolen_from_me: number;
  /** Number of times this client stole data from the peer */
  times_i_stole: number;
};

/**
 * Represents a peer with its counters and current state.
 */
export type Peer = {
  /** Performance and activity counters for the peer */
  counters: PeerCounters;
  /** Current state of the peer */
  state: PeerState;
};

/**
 * Statistics about peers associated with a torrent.
 */
export type TorrentPeerStats = {
  /** Mapping of peers identified by their address (IP or unique ID) */
  peers: Record<string, Peer>;
};

/**
 * General information about a torrent.
 */
export type TorrentInfo = {
  /** Hash of the torrent information */
  info_hash: string;
  /** Name of the torrent */
  name: string;
  /** List of files contained within the torrent */
  files: File[];
};

/**
 * Structure for adding a new torrent.
 */
export type AddTorrent = {
  /** Numeric identifier of the torrent */
  id: number;
  /** Details of the torrent (hash, name, and files) */
  details: TorrentInfo;
  /** Path to the output folder for the torrent files */
  output_folder: string;
  /** List of seen peers, or null if none were identified */
  seen_peers: string[] | null;
};

/**
 * Structure for listing torrents, omitting the ID.
 */
export type ListTorrent = Omit<AddTorrent, 'id'> & {
  /** ID will be null when listing torrents */
  id: null;
};

/**
 * Statistics related to a torrent based on its current state.
 * @template State - The state of the torrent, which defines the additional available data.
 */
export type TorrentStats<State extends TorrentState> = {
  /** Current state of the torrent */
  state: State;
  /** Progress of the files as percentages (0-100) */
  file_progress: number[];
  /** Error details, if any */
  error: string | null;
  /** Bytes downloaded so far */
  progress_bytes: number;
  /** Bytes uploaded so far */
  uploaded_bytes: number;
  /** Total bytes in the torrent */
  total_bytes: number;
  /** Indicates whether the torrent is completed */
  finished: boolean;
  /** Detailed statistics if the state is 'Live', or null otherwise */
  live: State extends TorrentState.Live ? LiveTorrentStats : null;
};

/**
 * Represents a speed metric.
 */
export interface Speed {
  /** Speed in Mbps */
  mbps: number;
  /** Human-readable representation of the speed */
  human_readable: string;
}

/**
 * Aggregated statistics about peers connected to a torrent.
 */
export interface AggregatePeerStats {
  /** Peers queued for connection */
  queued: number;
  /** Peers attempting to connect */
  connecting: number;
  /** Active connected peers */
  live: number;
  /** Total peers seen */
  seen: number;
  /** Peers that are dead or disconnected */
  dead: number;
  /** Peers that are no longer needed */
  not_needed: number;
}

/**
 * Detailed statistics for a torrent in the "Live" state.
 */
export type LiveTorrentStats = {
  /** Data captured at the current moment */
  snapshot: {
    have_bytes: number;
    downloaded_and_checked_bytes: number;
    downloaded_and_checked_pieces: number;
    fetched_bytes: number;
    uploaded_bytes: number;
    initially_needed_bytes: number;
    remaining_bytes: number;
    total_bytes: number;
    total_piece_download_ms: number;
    peer_stats: AggregatePeerStats;
  };
  /** Average time taken to download a piece */
  average_piece_download_time: {
    secs: number;
    nanos: number;
  };
  /** Download speed */
  download_speed: Speed;
  /** Upload speed */
  upload_speed: Speed;
  /** All-time average download speed */
  all_time_download_speed: Speed;
  /** Estimated time remaining for the torrent to complete */
  time_remaining: {
    human_readable: string;
    /** Detailed duration in seconds (optional) */
    duration?: {
      secs: number;
    };
  } | null;
};

/**
 * Represents an error related to the peer statistics of a torrent.
 */
export type TorrentPeerStatsError = {
  /** Kind of error */
  error_kind: string;
  /** Human-readable description of the error */
  human_readable: string;
  /** HTTP status code associated with the error */
  status: number;
  /** Text description of the HTTP status */
  status_text: string;
};
