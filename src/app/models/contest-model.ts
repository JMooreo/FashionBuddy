export interface Contest {
  id: string;
  createDateTime: string;
  closeDateTime: string;
  description: string;
  reportCount: number;
  options: Array<ContestOption>;
  style: string;
}

export interface ContestOption {
  id: string;
  imageUrl: string;
}
