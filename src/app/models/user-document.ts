export interface UserDocument {
  id?: string;
  messagingToken: string;
  firstName: string;
  email: string;
  isFeedEmpty: boolean;
  signUpDate: Date;
  lastActive: Date;
  points: 0;
  status: "Fashion Buddy";
  styles: [];
  occasions: [];
  deletedAccount: boolean;
}
