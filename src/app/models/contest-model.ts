export interface Contest {
  id?: string;
  options?: Array<ContestOption>;
  createDateTime: string;
  closeDateTime: string;
  occasion: string;
  reportCount: number;
  style: string;
}

export interface ContestOption {
  id?: string;
  imageUrl: string;
  votes: number;
}
