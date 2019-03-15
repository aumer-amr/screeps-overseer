import { SwarmHost } from "../swarmhosts/swarmhost";

export interface SwarmRoom extends RoomMemory {
	hosts: { [hostName: string]: SwarmHost; }
}
